import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from './ticket.service'; // ⚠️ ajuste ce chemin si besoin

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-form.html',
  styleUrls: ['./ticket-form.css']
})
export class TicketForm {
  ticketForm: FormGroup;
  isLoggedIn = true; // à remplacer par une vraie logique d’auth plus tard

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      requester: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const ticket: Ticket = this.ticketForm.value;

      console.log('📤 Envoi du ticket au backend :', ticket);

      this.ticketService.createTicket(ticket).subscribe({
        next: (response) => {
          console.log('✅ Ticket envoyé avec succès :', response);
          alert('Ticket envoyé avec succès !');
          this.ticketForm.reset();
        },
        error: (err) => {
          console.error('❌ Erreur lors de l’envoi :', err);
          alert('Erreur lors de l’envoi du ticket.');
        }
      });
    } else {
      console.warn('⚠️ Formulaire invalide');
      alert('Veuillez remplir tous les champs correctement.');
    }
  }
}
