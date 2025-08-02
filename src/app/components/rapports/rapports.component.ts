import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecoursService } from '../../services/recours.service';
import { TicketService } from '../../services/ticket.service';
import { ToastService } from '../../services/toast.service';

interface RapportFilters {
  dateDebut: string;
  dateFin: string;
  type: 'all' | 'recours' | 'tickets';
  statut: string;
  priorite: string;
}

interface KpiData {
  label: string;
  value: number;
  evolution: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rapports">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
        <p class="text-gray-600 mt-2">Tableaux de bord et indicateurs de performance</p>
      </div>

      <!-- Filtres -->
      <div class="card p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label class="form-label">Date début</label>
            <input type="date" [(ngModel)]="filters.dateDebut" (change)="applyFilters()" class="form-input">
          </div>
          <div>
            <label class="form-label">Date fin</label>
            <input type="date" [(ngModel)]="filters.dateFin" (change)="applyFilters()" class="form-input">
          </div>
          <div>
            <label class="form-label">Type</label>
            <select [(ngModel)]="filters.type" (change)="applyFilters()" class="form-select">
              <option value="all">Tous</option>
              <option value="recours">Recours</option>
              <option value="tickets">Tickets</option>
            </select>
          </div>
          <div>
            <label class="form-label">Statut</label>
            <select [(ngModel)]="filters.statut" (change)="applyFilters()" class="form-select">
              <option value="">Tous</option>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              <option value="RESOLU">Résolu</option>
              <option value="FERME">Fermé</option>
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="resetFilters()" class="btn btn-secondary w-full">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div *ngFor="let kpi of kpis" [ngClass]="'kpi-card ' + kpi.color">
          <div class="kpi-content">
            <div class="kpi-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getKpiIcon(kpi.icon)"></path>
              </svg>
            </div>
            <div class="kpi-data">
              <div class="kpi-value">{{ kpi.value }}</div>
              <div class="kpi-label">{{ kpi.label }}</div>
              <div class="kpi-evolution" [ngClass]="kpi.evolution >= 0 ? 'positive' : 'negative'">
                <span>{{ kpi.evolution > 0 ? '+' : '' }}{{ kpi.evolution }}%</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        [attr.d]="kpi.evolution >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques et analyses -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Répartition par statut -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
          <div class="space-y-3">
            <div *ngFor="let item of repartitionStatut" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded mr-3" [ngStyle]="{'background-color': item.color}"></div>
                <span class="text-sm text-gray-700">{{ item.label }}</span>
              </div>
              <div class="text-right">
                <div class="font-semibold">{{ item.value }}</div>
                <div class="text-xs text-gray-500">{{ item.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance par agent -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance par Agent</h3>
          <div class="space-y-3">
            <div *ngFor="let agent of performanceAgents" class="flex items-center justify-between p-3 border rounded">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary-600 font-medium text-sm">{{ agent.initiales }}</span>
                </div>
                <div>
                  <div class="font-medium">{{ agent.nom }}</div>
                  <div class="text-sm text-gray-600">{{ agent.role }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold">{{ agent.traites }}</div>
                <div class="text-sm text-gray-600">traités</div>
                <div class="text-xs" [ngClass]="agent.satisfaction >= 4 ? 'text-green-600' : agent.satisfaction >= 3 ? 'text-yellow-600' : 'text-red-600'">
                  ★ {{ agent.satisfaction }}/5
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Temps de résolution -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Temps de Résolution</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded">
                <div class="text-2xl font-bold text-blue-600">{{ tempsResolution.moyen }}h</div>
                <div class="text-sm text-blue-700">Temps moyen</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded">
                <div class="text-2xl font-bold text-green-600">{{ tempsResolution.slaRespect }}%</div>
                <div class="text-sm text-green-700">SLA respecté</div>
              </div>
            </div>
            <div class="space-y-2">
              <div *ngFor="let sla of tempsResolution.parType" class="flex justify-between items-center">
                <span class="text-sm text-gray-700">{{ sla.type }}</span>
                <div class="flex items-center">
                  <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="sla.performance"></div>
                  </div>
                  <span class="text-sm font-medium">{{ sla.performance }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Évolution temporelle -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution dans le temps</h3>
          <div class="space-y-4">
            <div *ngFor="let periode of evolutionTemporelle" class="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div class="font-medium">{{ periode.periode }}</div>
                <div class="text-sm text-gray-600">{{ periode.description }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold text-lg">{{ periode.total }}</div>
                <div class="text-sm" [ngClass]="periode.evolution >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ periode.evolution > 0 ? '+' : '' }}{{ periode.evolution }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions d'export -->
      <div class="card p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Exporter les données</h3>
        <div class="flex flex-wrap gap-4">
          <button (click)="exportExcel()" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exporter Excel
          </button>
          <button (click)="exportPDF()" class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Exporter PDF
          </button>
          <button (click)="sendEmail()" class="btn btn-success">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Envoyer par email
          </button>
          <button (click)="scheduleReport()" class="btn btn-info">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Programmer
          </button>
        </div>
      </div>

      <!-- Tableaux de données détaillées -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Statistiques Recours -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Statistiques Recours</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total recours</span>
              <span class="font-bold text-2xl text-primary-600">{{ recoursStats.total }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Nouveaux</span>
              <span class="font-semibold text-red-600">{{ recoursStats.nouveau }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">En cours</span>
              <span class="font-semibold text-yellow-600">{{ recoursStats.enCours }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Résolus</span>
              <span class="font-semibold text-green-600">{{ recoursStats.resolu }}</span>
            </div>
          </div>
        </div>

        <!-- Statistiques Tickets -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Statistiques Tickets IT</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total tickets</span>
              <span class="font-bold text-2xl text-primary-600">{{ ticketsStats.total }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Nouveaux</span>
              <span class="font-semibold text-red-600">{{ ticketsStats.nouveau }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">En cours</span>
              <span class="font-semibold text-yellow-600">{{ ticketsStats.enCours }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Résolus</span>
              <span class="font-semibold text-green-600">{{ ticketsStats.resolu }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      @apply rounded-lg p-6 shadow-sm border;
    }
    .kpi-card.blue { @apply bg-blue-50 border-blue-200; }
    .kpi-card.green { @apply bg-green-50 border-green-200; }
    .kpi-card.yellow { @apply bg-yellow-50 border-yellow-200; }
    .kpi-card.red { @apply bg-red-50 border-red-200; }
    
    .kpi-content {
      @apply flex items-center;
    }
    
    .kpi-icon {
      @apply w-12 h-12 rounded-lg flex items-center justify-center mr-4;
    }
    
    .kpi-card.blue .kpi-icon { @apply bg-blue-100 text-blue-600; }
    .kpi-card.green .kpi-icon { @apply bg-green-100 text-green-600; }
    .kpi-card.yellow .kpi-icon { @apply bg-yellow-100 text-yellow-600; }
    .kpi-card.red .kpi-icon { @apply bg-red-100 text-red-600; }
    
    .kpi-value {
      @apply text-2xl font-bold text-gray-900;
    }
    
    .kpi-label {
      @apply text-sm text-gray-600;
    }
    
    .kpi-evolution {
      @apply flex items-center text-xs font-medium mt-1;
    }
    
    .kpi-evolution.positive {
      @apply text-green-600;
    }
    
    .kpi-evolution.negative {
      @apply text-red-600;
    }
  `]
})
export class RapportsComponent implements OnInit {
  filters: RapportFilters = {
    dateDebut: '',
    dateFin: '',
    type: 'all',
    statut: '',
    priorite: ''
  };

  kpis: KpiData[] = [
    {
      label: 'Total Recours',
      value: 127,
      evolution: 12,
      icon: 'file',
      color: 'blue'
    },
    {
      label: 'Tickets IT',
      value: 89,
      evolution: -5,
      icon: 'tool',
      color: 'green'
    },
    {
      label: 'Taux Résolution',
      value: 94,
      evolution: 8,
      icon: 'check',
      color: 'yellow'
    },
    {
      label: 'SLA Respecté',
      value: 87,
      evolution: -2,
      icon: 'clock',
      color: 'red'
    }
  ];

  repartitionStatut = [
    { label: 'Nouveau', value: 23, percentage: 18, color: '#ef4444' },
    { label: 'En cours', value: 45, percentage: 35, color: '#f59e0b' },
    { label: 'Résolu', value: 52, percentage: 41, color: '#10b981' },
    { label: 'Fermé', value: 7, percentage: 6, color: '#6b7280' }
  ];

  evolutionTemporelle = [
    {
      periode: 'Cette semaine',
      description: '2-8 Août 2025',
      total: 34,
      evolution: 15
    },
    {
      periode: 'Semaine dernière',
      description: '26 Juil - 1 Août',
      total: 28,
      evolution: -8
    },
    {
      periode: 'Ce mois',
      description: 'Août 2025',
      total: 127,
      evolution: 22
    },
    {
      periode: 'Mois dernier',
      description: 'Juillet 2025',
      total: 104,
      evolution: 5
    }
  ];

  performanceAgents = [
    {
      nom: 'Marie Kouassi',
      initiales: 'MK',
      role: 'Agent Recours',
      traites: 23,
      satisfaction: 4.7
    },
    {
      nom: 'Jean Ouattara',
      initiales: 'JO',
      role: 'Technicien IT',
      traites: 19,
      satisfaction: 4.2
    },
    {
      nom: 'Fatou Diallo',
      initiales: 'FD',
      role: 'Superviseur',
      traites: 15,
      satisfaction: 4.9
    },
    {
      nom: 'Koffi Assi',
      initiales: 'KA',
      role: 'Agent IT',
      traites: 12,
      satisfaction: 3.8
    }
  ];

  tempsResolution = {
    moyen: 18.5,
    slaRespect: 87,
    parType: [
      { type: 'Recours Facturation', performance: 92 },
      { type: 'Tickets Technique', performance: 85 },
      { type: 'Demandes Accès', performance: 95 },
      { type: 'Incidents Majeurs', performance: 78 }
    ]
  };

  recoursStats: any = {};
  ticketsStats: any = {};

  constructor(
    private recoursService: RecoursService,
    private ticketService: TicketService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.loadData();
  }

  initializeFilters(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.filters.dateDebut = firstDay.toISOString().split('T')[0];
    this.filters.dateFin = today.toISOString().split('T')[0];
  }

  loadData(): void {
    // Charger les statistiques des recours
    this.recoursService.getStatistiques().subscribe(stats => {
      this.recoursStats = stats;
    });

    // Charger les statistiques des tickets
    this.ticketService.getStatistiques().subscribe(stats => {
      this.ticketsStats = stats;
    });
  }

  applyFilters(): void {
    console.log('Application des filtres:', this.filters);
    this.loadData();
  }

  resetFilters(): void {
    this.filters = {
      dateDebut: '',
      dateFin: '',
      type: 'all',
      statut: '',
      priorite: ''
    };
    this.initializeFilters();
    this.loadData();
  }

  getKpiIcon(icon: string): string {
    const icons: {[key: string]: string} = {
      'file': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      'tool': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'check': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[icon] || icons['file'];
  }

  exportExcel(): void {
    console.log('Export Excel déclenché');
    this.toastService.info('Export Excel', 'Export Excel en cours de développement...');
  }

  exportPDF(): void {
    console.log('Export PDF déclenché');
    this.toastService.info('Export PDF', 'Export PDF en cours de développement...');
  }

  sendEmail(): void {
    console.log('Envoi email déclenché');
    this.toastService.info('Envoi par email', 'Envoi par email en cours de développement...');
  }

  scheduleReport(): void {
    console.log('Programmation rapport déclenchée');
    this.toastService.info('Programmation', 'Programmation de rapports en cours de développement...');
  }
}
