import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyTicketService } from '../mytickets/myticket.service';
import { Ticket } from '../mytickets/myticket.service';
import { EmployeService } from '../mytickets/employe.service';
import { Employe } from '../mytickets/employe.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface KanbanTask extends Ticket {
  kanbanStatus: 'ouvert' | 'en-cour' | 'ferme'; // Exactement comme dans la base
}

interface KanbanColumn {
  id: 'ouvert' | 'en-cour' | 'ferme'; // IDs exacts
  title: string;
  tasks: KanbanTask[];
}
@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mytickets.html',
  styleUrls: ['./mytickets.css']
})
export class KanbanBoardComponent implements OnInit {
  employes: Employe[] = [];
 public columns: KanbanColumn[] = [
  { id: 'ouvert', title: 'Ouvert', tasks: [] },
  { id: 'en-cour', title: 'En cours', tasks: [] }, // Titre affiché avec "s" mais ID sans
  { id: 'ferme', title: 'Fermé', tasks: [] }       // Titre accentué si souhaité
];
  public selectedTask: KanbanTask | null = null;
  public selectedColumnId: 'ouvert' | 'en-cour' | 'ferme' | null = null;
  public isLoading: boolean = true;
  public isDragging: boolean = false;
  public isUpdating: boolean = false;
  public showAttachmentViewer: boolean = false;
  public selectedEmployeId: number | null = null;

  constructor(
    private ticketService: MyTicketService,
    private employeService: EmployeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllTickets();
    console.log('Colonnes après chargement:', this.columns);
    this.loadEmployes();
  } 

onEmployeChange(): void {
  if (this.selectedEmployeId) {
    this.ticketService.getTicketsByEmploye(this.selectedEmployeId).subscribe({
      next: (tickets) => {
        this.initializeKanbanColumns(tickets);
      },
      error: (err) => console.error(err)
    });
  } else {
    // Optionnel : afficher tous les tickets ou rien
    this.columns.forEach(col => col.tasks = []);
  }
}
  private loadEmployes(): void {
    this.employeService.getEmployes().subscribe({
      next: (employes) => {
        this.employes = employes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés', error);
        this.showError('Erreur de chargement des employés');
      }
    });
  }

loadAllTickets(): void {
  this.isLoading = true;
  this.ticketService.getTickets().subscribe({
    next: (tickets) => {
    tickets.forEach(t => console.log(`Ticket #${t.id} assignedTo:`, t.assignedToName));
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
    const kanbanStatus = this.normalizeStatus(ticket.status);

    const column = this.columns.find(col => col.id === kanbanStatus);
   console.log(`Ticket #${ticket.id} assignedToName: ${ticket.assignedToName}`);
    if (column) {
      column.tasks.push({
        ...ticket,
        kanbanStatus: kanbanStatus,
        status: this.mapToApiStatus(kanbanStatus),
       assignedToName: ticket.assignedToName || null
 // < // <-- assure-toi que c’est là
      });
    } else {
      console.warn(`Statut inconnu: ${ticket.status} - Ticket placé dans "Ouvert" par défaut`);
      this.columns[0].tasks.push({
        ...ticket,
        kanbanStatus: 'ouvert',
        status: 'ouvert',
    assignedToName: ticket.assignedToName|| null 
      });
    }
  });
}

private normalizeStatus(apiStatus?: string): 'ouvert' | 'en-cour' | 'ferme' {
  if (!apiStatus) return 'ouvert';

  const cleanedStatus = apiStatus.toLowerCase().trim();

  if (cleanedStatus === 'en-cour' || cleanedStatus === 'en-cours') return 'en-cour';
  if (cleanedStatus === 'ferme') return 'ferme';
  return 'ouvert'; // fallback
}



  private mapToApiStatus(kanbanStatus: string): string {
    switch (kanbanStatus) {
      case 'en-cour': return 'en-cour';
      case 'ferme': return 'ferme';
      default: return 'ouvert';
    }
  }

  public onDrop(event: DragEvent, targetColumnId: 'ouvert' | 'en-cour' | 'ferme'): void {
    event.preventDefault();
    this.isDragging = false;
    
    const data = event.dataTransfer?.getData('text/plain');
    if (!data) return;

    const [taskIdStr, sourceColumnId] = data.split('|');
    const taskId = Number(taskIdStr);

    if (isNaN(taskId)) return;

    this.moveTask(taskId, sourceColumnId as 'ouvert' | 'en-cour' | 'ferme', targetColumnId);
  }

  private moveTask(taskId: number, sourceColumnId: string, targetColumnId: string): void {
    if (sourceColumnId === targetColumnId) return;
    this.isUpdating = true;

    const sourceColumn = this.columns.find(c => c.id === sourceColumnId);
    const targetColumn = this.columns.find(c => c.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = sourceColumn.tasks[taskIndex];
    const previousStatus = task.kanbanStatus;
    const apiStatus = this.mapToApiStatus(targetColumnId);

    // Mise à jour optimiste
    task.kanbanStatus = targetColumnId as 'ouvert' | 'en-cour' | 'ferme';
    task.status = apiStatus;
    sourceColumn.tasks.splice(taskIndex, 1);
    targetColumn.tasks.push(task);

    this.ticketService.updateStatut(task.id, apiStatus).subscribe({
      next: () => {
        this.isUpdating = false;
        this.showSuccess('Statut mis à jour');
         this.loadAllTickets(); 
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isUpdating = false;
        // Rollback
        task.kanbanStatus = previousStatus;
        task.status = this.mapToApiStatus(previousStatus);
        targetColumn.tasks = targetColumn.tasks.filter(t => t.id !== task.id);
        sourceColumn.tasks.splice(taskIndex, 0, task);
        this.showError('Échec de la mise à jour');
        this.loadAllTickets();
      }
    });
  }

  public openEditForm(task: KanbanTask, columnId: 'ouvert' | 'en-cour' | 'ferme'): void {
    this.selectedTask = { ...task };
    this.selectedColumnId = columnId;
  }

  public closeEditForm(): void {
    this.selectedTask = null;
    this.selectedColumnId = null;
  }

  public saveTaskChanges(): void {
    if (!this.selectedTask) return;
    this.isUpdating = true;

    this.selectedTask.status = this.mapToApiStatus(this.selectedTask.kanbanStatus);

    this.ticketService.updateTicket(this.selectedTask).subscribe({
      next: (updatedTicket) => {
        this.isUpdating = false;
        this.updateLocalTask({
          ...updatedTicket,
          kanbanStatus: this.normalizeStatus(updatedTicket.status)
        });
        this.closeEditForm();
        this.showSuccess('Ticket mis à jour');
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isUpdating = false;
        this.showError('Échec de la mise à jour');
        this.loadAllTickets();
      }
    });
  }

  private updateLocalTask(updatedTask: KanbanTask): void {
    for (const column of this.columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        if (column.id === updatedTask.kanbanStatus) {
          column.tasks[taskIndex] = updatedTask;
        } else {
          column.tasks.splice(taskIndex, 1);
          const newColumn = this.columns.find(c => c.id === updatedTask.kanbanStatus);
          if (newColumn) newColumn.tasks.push(updatedTask);
        }
        break;
      }
    }
  }

  public getAttachmentName(path?: string | null): string {
    if (!path) return 'Pièce jointe';
    return path.split('/').pop() || 'Pièce jointe';
  }

  public isImageFile(path?: string | null): boolean {
    if (!path) return false;
    const lower = path.toLowerCase();
    return lower.endsWith('.png') || lower.endsWith('.jpg') || 
           lower.endsWith('.jpeg') || lower.endsWith('.gif');
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', { 
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', { 
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  public allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  public startDrag(event: DragEvent, taskId: number, columnId: 'ouvert' | 'en-cour' | 'ferme'): void {
    this.isDragging = true;
    event.dataTransfer?.setData('text/plain', `${taskId}|${columnId}`);
  }

  public endDrag(): void {
    this.isDragging = false;
  }

  public trackByColumnId(index: number, column: KanbanColumn): string {
    return column.id;
  }

  public trackByTaskId(index: number, task: KanbanTask): number {
    return task.id;
  }

  public hasNoTickets(): boolean {
    return this.columns.every(col => col.tasks.length === 0);
  }

  public hasTickets(): boolean {
    return !this.hasNoTickets();
  }
}