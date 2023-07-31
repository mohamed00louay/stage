import { Component, OnInit } from '@angular/core';
import { Formateur } from './formateur';
import { FormateurService } from './formateur.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public formateurs: Formateur[] = [];
  public editFormateur!: Formateur;
  public deleteFormateur!: Formateur;
  public searchKey: string = '';
  selectedPhoto: File | undefined;

  constructor(private formateurService: FormateurService){}

  ngOnInit() {
    this.getFormateurs();
  }

  public getFormateurs(): void {
    this.formateurService.getFormateurs().subscribe(
      (response: Formateur[]) => {
        this.formateurs = response;
        console.log(this.formateurs);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddFormateur(addForm: NgForm): void {

      const capitalizeWord = (word: string) => {
      return word
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (txt) => txt.toUpperCase());
    };
  
    const newFormateur: Formateur = {
      id: undefined,
      formateurCode: undefined,
      name: capitalizeWord(addForm.value.name),
      email: addForm.value.email.trim(),
      expertise: capitalizeWord(addForm.value.expertise),
      phone: addForm.value.phone,
    };
  
    if (!this.isFormateurValid(newFormateur)) {
      alert('Invalid formateur data. Please check your inputs.');
      addForm.reset();
      return;
    }
  
    if (this.isFormateurDuplicate(newFormateur)) {
      alert('A formateur with the same name or email already exists.');
      addForm.reset();
      return;
    }
  
    this.formateurService.addFormateur(newFormateur).subscribe(
      (response: Formateur) => {
        console.log(response);
        this.getFormateurs();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }
  
  

  private isFormateurValid(formateur: Formateur): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+216\d{8}$/;
    return (
      emailRegex.test(formateur.email) &&
      phoneRegex.test(formateur.phone) &&
      formateur.expertise.trim() !== ''
    );
  }

  private isFormateurDuplicate(newFormateur: Formateur): boolean {
    return this.formateurs.some(
      (formateur) => formateur.name === newFormateur.name || formateur.email === newFormateur.email
    );
  }
  

  public onUpdateFormateur(formateur: Formateur): void {
    const capitalizeWord = (word: string) => {
      return word
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (txt) => txt.toUpperCase());
    };
  
    const updatedFormateur: Formateur = {
      id: formateur.id,
      formateurCode: formateur.formateurCode,
      name: capitalizeWord(formateur.name),
      email: formateur.email.trim(),
      expertise: capitalizeWord(formateur.expertise),
      phone: formateur.phone,
    };
  
    if (!this.isFormateurValid(updatedFormateur)) {
      alert('Invalid formateur data. Please check your inputs.');
      return;
    }
  
    if (this.isFormateurDuplicate(updatedFormateur)) {
      alert('A formateur with the same name or email already exists.');
      return;
    }
  
    this.formateurService.updateFormateur(updatedFormateur).subscribe(
      (response: Formateur) => {
        console.log(response);
        this.getFormateurs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  

  public onDeleteFormateur(formateurId: number): void {
    this.formateurService.deleteFormateur(formateurId).subscribe(
      (response: void) => {
        console.log(response);
        this.getFormateurs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchFormateurs(key: string): void {
    console.log(key);
    this.searchKey = key.trim();
  
    if (!this.searchKey) {
      this.getFormateurs();
    return;
  }
  
    const results: Formateur[] = this.formateurs.filter((formateur) => {
      const searchTerm = key.toLowerCase();
      return (
        formateur.name.toLowerCase().includes(searchTerm) ||
        formateur.email.toLowerCase().includes(searchTerm) ||
        formateur.phone.toLowerCase().includes(searchTerm) ||
        formateur.expertise.toLowerCase().includes(searchTerm)
      );
    });
  
    this.formateurs = results;
  }

  public onOpenModal(formateur: Formateur | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      this.editFormateur = {} as Formateur; 
      button.setAttribute('data-target', '#addFormateurModal');
    }
    if (mode === 'edit') {
      this.editFormateur = formateur || ({} as Formateur); 
      button.setAttribute('data-target', '#updateFormateurModal');
    }
    if (mode === 'delete') {
      this.deleteFormateur = formateur || ({} as Formateur); 
      button.setAttribute('data-target', '#deleteFormateurModal');
    }
    container?.appendChild(button);
    button.click();
  }
  

}