import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ticket-form.html',
  styleUrls: ['./ticket-form.css']
})
export class TicketFormComponent implements OnInit {
  ticketForm!: FormGroup;
  selectedFile: File | null = null;
  attachmentError: string | null = null;
  isLoggedIn = true; // Gère selon ton contexte réel

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      userName: ['', Validators.required],
      requester: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.attachmentError = null;
    const file: File = event.target.files[0];

    if (file) {
      const maxSizeMB = 5;
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.attachmentError = 'Format de fichier non supporté.';
        this.selectedFile = null;
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        this.attachmentError = `La taille du fichier doit être inférieure à ${maxSizeMB}MB.`;
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('UserName', this.ticketForm.get('userName')?.value);
    formData.append('Requester', this.ticketForm.get('requester')?.value);
    formData.append('Title', this.ticketForm.get('title')?.value);
    formData.append('Description', this.ticketForm.get('description')?.value);
    formData.append('Category', this.ticketForm.get('category')?.value);
    formData.append('Priority', this.ticketForm.get('priority')?.value);

    if (this.selectedFile) {
      formData.append('File', this.selectedFile, this.selectedFile.name);
    } else {
      console.warn("⚠️ Aucun fichier sélectionné.");
    }

    // DEBUG : Affiche les données envoyées
    console.log("📤 Données envoyées au backend :");
    [...formData.entries()].forEach(([key, value]) => {
      console.log(` - ${key}:`, value);
    });

    this.http.post('https://localhost:7224/api/Tickets', formData).subscribe({
      next: (res) => {
        console.log("✅ Ticket envoyé avec succès :", res);
        alert('Ticket envoyé avec succès !');
        this.ticketForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error("❌ Erreur lors de l’envoi du ticket :", err);
        alert('Erreur lors de l’envoi du ticket.');
      }
    });
  }
}
