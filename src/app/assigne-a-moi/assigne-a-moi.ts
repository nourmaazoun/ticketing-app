import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyTicketService } from '../mytickets/myticket.service';
import { Ticket } from '../mytickets/myticket.service';
import { EmployeService } from '../mytickets/employe.service';
import { Employe } from '../mytickets/employe.service'


interface KanbanTask extends Ticket {
  kanbanStatus: 'ouvert' | 'en-cours' | 'ferme';
}

interface KanbanColumn {
  id: 'ouvert' | 'en-cours' | 'ferme';
  title: string;
  tasks: KanbanTask[];
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigne-a-moi.html',
  styleUrls: ['./assigne-a-moi.css']
})
export class AssigneAMoiComponent implements OnInit {
  employes: Employe[] = [];
  public columns: KanbanColumn[] = [
    { id: 'ouvert', title: 'Ouvert', tasks: [] },
    { id: 'en-cours', title: 'En cours', tasks: [] },
    { id: 'ferme', title: 'Fermé', tasks: [] }
  ];

  public selectedTask: KanbanTask | null = null;
  public selectedColumnId: 'ouvert' | 'en-cours' | 'ferme' | null = null;
  public isLoading: boolean = true;
  public isDragging: boolean = false;

    constructor(
    private ticketService: MyTicketService,
    private employeService: EmployeService // Injectez le service EmployeService
  ) {}

 ngOnInit(): void {
    this.loadAssignedTickets();
    this.loadEmployes();
  }
   loadEmployes(): void {
    this.employeService.getEmployes().subscribe({
      next: (employes) => {
        this.employes = employes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés', error);
      }
    });
  }
  // Méthodes trackBy pour l'optimisation
  public trackByColumnId(index: number, column: KanbanColumn): string {
    return column.id;
  }

  public trackByTaskId(index: number, task: KanbanTask): number {
    return task.id;
  }

  // Gestion des tickets
  public hasNoTickets(): boolean {
    return !this.hasTickets();
  }

  public hasTickets(): boolean {
    return this.columns.some(col => col.tasks.length > 0);
  }

  private loadAssignedTickets(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId || isNaN(userId)) {
      console.error('ID utilisateur invalide');
      this.isLoading = false;
      return;
    }

    this.ticketService.getTicketsByEmploye(userId).subscribe({
      next: (tickets) => {
        this.initializeKanbanColumns(tickets);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  private initializeKanbanColumns(tickets: Ticket[]): void {
    this.columns.forEach(col => col.tasks = []);

    tickets.forEach(ticket => {
      const kanbanTask: KanbanTask = {
        ...ticket,
        kanbanStatus: this.normalizeStatus(ticket.status),
        attachmentPath: ticket.attachmentPath ?? null,
        
      };
console.log('Ticket reçu:', ticket);
console.log('AttachmentPath:', ticket.attachmentPath);

      const targetColumn = this.columns.find(col => col.id === kanbanTask.kanbanStatus);
      if (targetColumn) {
        targetColumn.tasks.push(kanbanTask);
      }
    });
  }
private normalizeStatus(status?: string): 'ouvert' | 'en-cours' | 'ferme' {
  if (!status) return 'ouvert';
  const normalized = status.toLowerCase().trim();

  if (normalized === 'en-cours') return 'en-cours';
  if (normalized === 'ferme') return 'ferme';
  return 'ouvert';
}


  // Gestion du formulaire
 public openEditForm(task: KanbanTask, columnId: 'ouvert' | 'en-cours' | 'ferme'): void {
  this.selectedTask = { ...task };
  this.selectedColumnId = columnId;
  

  // Log pour vérifier la pièce jointe
  console.log('Ticket sélectionné pour édition:', this.selectedTask);
  console.log('Chemin de la pièce jointe:', this.selectedTask.attachmentPath);
}


  public closeEditForm(): void {
    this.selectedTask = null;
    this.selectedColumnId = null;
  }
saveTaskChanges(): void {
  if (!this.selectedTask) return;

  this.selectedTask.statut = this.mapToApiStatus(this.selectedTask.kanbanStatus);

  // Assigner null si undefined ou autre
  if (this.selectedTask.assignedToId === undefined) {
    this.selectedTask.assignedToId = null;
  }

  this.ticketService.updateTicket(this.selectedTask).subscribe({
    next: (updatedTicket) => {
      const updatedTask: KanbanTask = {
        ...updatedTicket,
        kanbanStatus: this.normalizeStatus(updatedTicket.statut || updatedTicket.status),
      };

      this.updateLocalTask(updatedTask);
      this.closeEditForm();
    },
    error: (err) => {
      console.error('Échec de mise à jour', err);
      this.loadAssignedTickets();
    }
  });


  this.ticketService.updateTicket(this.selectedTask).subscribe({
    next: (updatedTicket) => {
      const updatedTask: KanbanTask = {
        ...updatedTicket,
        kanbanStatus: this.normalizeStatus(updatedTicket.statut || updatedTicket.status),
      };

      this.updateLocalTask(updatedTask);
      this.closeEditForm();
    },
    error: (err) => {
      console.error('Échec de mise à jour', err);
      this.loadAssignedTickets();
    }
  });
}

// Méthode utilitaire pour mettre à jour localement une tâche
private updateLocalTask(updatedTask: KanbanTask): void {
  for (const column of this.columns) {
    const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
    if (taskIndex !== -1) {
      // Si le statut n'a pas changé
      if (column.id === updatedTask.kanbanStatus) {
        column.tasks[taskIndex] = updatedTask;
      } 
      // Si le statut a changé
      else {
        column.tasks.splice(taskIndex, 1);
        const newColumn = this.columns.find(c => c.id === updatedTask.kanbanStatus);
        if (newColumn) {
          newColumn.tasks.push(updatedTask);
        }
      }
      break;
    }
  }
}

private mapToApiStatus(kanbanStatus: string): string {
  switch (kanbanStatus) {
    case 'en-cours': return 'en-cours';  // correspond exactement à la valeur en base
    case 'ferme': return 'ferme';
    default: return 'ouvert';
  }
}
// Drag & Drop
  public onDrop(event: DragEvent, targetColumnId: 'ouvert' | 'en-cours' | 'ferme'): void {
    event.preventDefault();
    this.isDragging = false;
    
    const data = event.dataTransfer?.getData('text/plain');
    if (!data) return;

    const [taskIdStr, sourceColumnId] = data.split('|');
    const taskId = Number(taskIdStr);

    if (isNaN(taskId)) return;

    this.moveTask(taskId, sourceColumnId as 'ouvert' | 'en-cours' | 'ferme', targetColumnId);
  }

  private moveTask(taskId: number, sourceColumnId: string, targetColumnId: string): void {
  if (sourceColumnId === targetColumnId) return;

  const sourceColumn = this.columns.find(c => c.id === sourceColumnId);
  const targetColumn = this.columns.find(c => c.id === targetColumnId);

  if (!sourceColumn || !targetColumn) return;

  const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const task = sourceColumn.tasks[taskIndex];

  // 🔧 Mise à jour directe de la tâche
  task.kanbanStatus = targetColumnId as 'ouvert' | 'en-cours' | 'ferme';
  task.status = this.mapToApiStatus(targetColumnId);

  // 🔁 Déplacement entre colonnes
  sourceColumn.tasks.splice(taskIndex, 1);
  targetColumn.tasks.push(task);

  // ✅ Mise à jour côté serveur
  this.ticketService.updateStatut(taskId, task.status).subscribe({
    error: (err) => {
      console.error('Erreur:', err);
      this.loadAssignedTickets();
    }
  });
}


  public allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  public startDrag(event: DragEvent, taskId: number, columnId: 'ouvert' | 'en-cours' | 'ferme'): void {
    this.isDragging = true;
    event.dataTransfer?.setData('text/plain', `${taskId}|${columnId}`);
  }

  public endDrag(): void {
    this.isDragging = false;
  }
 // Adapté pour accepter string | undefined | null
isImageFile(path?: string | null): boolean {
  if (!path) return false;
  const lower = path.toLowerCase();
  return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif');
}
public showAttachmentViewer = false;

public openAttachmentViewer(): void {
  this.showAttachmentViewer = true;
}

public closeAttachmentViewer(): void {
  this.showAttachmentViewer = false;
}


}