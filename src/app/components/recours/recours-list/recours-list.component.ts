import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecoursService } from '../../../services/recours.service';
import { Recours, StatutRecours, TypeRecours, CanalEntree } from '../../../models';

@Component({
  selector: 'app-recours-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recours-list.component.html',
  styleUrls: ['./recours-list.component.scss']
})
export class RecoursListComponent implements OnInit {
  recours: Recours[] = [];
  filteredRecours: Recours[] = [];
  searchTerm = '';
  statusFilter = '';
  typeFilter = '';
  canalFilter = '';
  
  // Enums pour les templates
  StatutRecours = StatutRecours;
  TypeRecours = TypeRecours;
  CanalEntree = CanalEntree;

  constructor(private recoursService: RecoursService) {}

  ngOnInit(): void {
    this.loadRecours();
  }

  loadRecours(): void {
    this.recoursService.getAllRecours().subscribe(recours => {
      this.recours = recours;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredRecours = this.recours.filter(recours => {
      const matchesSearch = !this.searchTerm || 
        recours.numeroRecours.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        recours.requrantNom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        recours.requrantPrenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        recours.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || recours.statut === this.statusFilter;
      const matchesType = !this.typeFilter || recours.typeRecours === this.typeFilter;
      const matchesCanal = !this.canalFilter || recours.canalEntree === this.canalFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesCanal;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.canalFilter = '';
    this.applyFilters();
  }

  getStatutBadgeClass(statut: StatutRecours): string {
    switch (statut) {
      case StatutRecours.NOUVEAU:
        return 'bg-red-100 text-red-800';
      case StatutRecours.EN_COURS:
        return 'bg-yellow-100 text-yellow-800';
      case StatutRecours.EN_ATTENTE:
        return 'bg-blue-100 text-blue-800';
      case StatutRecours.RESOLU:
        return 'bg-green-100 text-green-800';
      case StatutRecours.FERME:
        return 'bg-gray-100 text-gray-800';
      case StatutRecours.REJETE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: StatutRecours): string {
    switch (statut) {
      case StatutRecours.NOUVEAU:
        return 'Nouveau';
      case StatutRecours.EN_COURS:
        return 'En cours';
      case StatutRecours.EN_ATTENTE:
        return 'En attente';
      case StatutRecours.RESOLU:
        return 'Résolu';
      case StatutRecours.FERME:
        return 'Fermé';
      case StatutRecours.REJETE:
        return 'Rejeté';
      default:
        return statut;
    }
  }

  getTypeLabel(type: TypeRecours): string {
    switch (type) {
      case TypeRecours.LITIGE_FACTURATION:
        return 'Litige facturation';
      case TypeRecours.QUALITE_SERVICE:
        return 'Qualité service';
      case TypeRecours.COUPURE_ABUSIVE:
        return 'Coupure abusive';
      case TypeRecours.RACCORDEMENT:
        return 'Raccordement';
      case TypeRecours.AUTRE:
        return 'Autre';
      default:
        return type;
    }
  }

  getCanalLabel(canal: CanalEntree): string {
    switch (canal) {
      case CanalEntree.SITE_WEB:
        return 'Site Web';
      case CanalEntree.TELEPHONE:
        return 'Téléphone';
      case CanalEntree.EMAIL:
        return 'Email';
      case CanalEntree.PHYSIQUE:
        return 'Physique';
      case CanalEntree.WHATSAPP:
        return 'WhatsApp';
      case CanalEntree.FACEBOOK:
        return 'Facebook';
      case CanalEntree.TWITTER:
        return 'Twitter';
      default:
        return canal;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getUrgencyClass(recours: Recours): string {
    const now = new Date();
    const echeance = new Date(recours.dateEcheance || recours.dateCreation);
    const diffDays = Math.ceil((echeance.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'border-l-4 border-red-500'; // Dépassé
    if (diffDays <= 2) return 'border-l-4 border-orange-500'; // Urgent
    if (diffDays <= 7) return 'border-l-4 border-yellow-500'; // Attention
    return 'border-l-4 border-green-500'; // Normal
  }
}
