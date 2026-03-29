/*import { Component, OnInit } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { Candidate } from '../../models/candidate.model';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { SubscriptionService } from '../../services/subscription.service';
import { CandidateService } from '../../services/candidate.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-store',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subscription-store.component.html',
  styleUrls: ['./subscription-store.component.scss'],
})
export class SubscriptionStoreComponent implements OnInit {
  subscriptions: Subscription[] = [];

  subscriptionForm: FormGroup;

  candidats: Candidate[] = [];
  availableCandidats: Candidate[] = [];

  successMessage = '';
  errorMessage = '';

  currentSubscription: Subscription | null = null;

  step = 1;

  currentPermissions: any = {};
  newSubscriptionPermissions: any = {};

  permissionKeys = [
    'prodWithImg',
    'prodWithVar',
    'prodWithSearch',
    'prodLim',
    'varLim',
    'purLim',
    'salLim',
    'expLim',
    'prflLim',
    'withStore',
  ];

  permLabels: any = {
    prodWithImg: 'Produits avec Images',
    prodWithVar: 'Produits avec Variantes',
    prodWithSearch: 'Recherche de Produits',
    prodLim: 'Limite de Produits',
    varLim: 'Limite de Variantes',
    purLim: "Limite d'Achats",
    salLim: 'Limite de Ventes',
    expLim: 'Limite de Dépenses',
    prflLim: 'Limite de Comptes',
    withStore: 'Gestion Boutique',
  };

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private candidateService: CandidateService
  ) {
    this.subscriptionForm = this.fb.group({
      candidat_id: [null, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  // ================= LOAD =================

  loadSubscriptions(): void {
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (res) => {
        this.subscriptions = res;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des abonnements.';
        this.hideMessageAfterDelay();
      },
    });
  }

  loadAvailableCandidats(): void {
    this.candidateService.getAllCandidates().subscribe({
      next: (res) => {
        this.availableCandidats = res;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des candidats.';
        this.hideMessageAfterDelay();
      },
    });
  }

  // ================= MODAL =================

  openAddSubscriptionModal(): void {
    this.step = 1;
    this.loadAvailableCandidats();
    this.subscriptionForm.reset();
    this.newSubscriptionPermissions = {};
    this.successMessage = '';
    this.errorMessage = '';
  }

  nextStep(): void {
    if (this.subscriptionForm.valid) {
      this.step = 2;

      this.newSubscriptionPermissions = {
        prodWithImg: 0,
        prodWithVar: 0,
        prodWithSearch: 0,
        prodLim: 20,
        varLim: 20,
        purLim: 20,
        salLim: 20,
        expLim: 20,
        prflLim: 20,
        withStore: 0,
      };
    } else {
      this.subscriptionForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir correctement les informations.';
      this.hideMessageAfterDelay();
    }
  }

  previousStep(): void {
    this.step = 1;
  }

  // ================= CREATE =================

  ajouterSubscription(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const permissionsString = Object.entries(this.newSubscriptionPermissions)
      .map(([key, val]) => `${key}:${val ?? 0}`)
      .join(',');

    const now = new Date();

    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    const newSubscription: Subscription = {
      candidate_id: Number(this.subscriptionForm.value.candidate_id),
      start_date: this.subscriptionForm.value.start_date,
      end_date: this.subscriptionForm.value.end_date,
      created_at: formattedDate,
      created_by: 1,
      autorisation: permissionsString,
    };

    this.subscriptionService.createSubscription(newSubscription).subscribe({
      next: () => {
        this.successMessage = 'Abonnement ajouté avec succès';
        this.loadSubscriptions();
        this.closeModal('addSubscriptionModal');
        this.subscriptionForm.reset();
        this.step = 1;
        this.hideMessageAfterDelay();
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'ajout de l'abonnement";
        this.hideMessageAfterDelay();
      },
    });
  }

  // ================= PERMISSIONS =================

  openPermissionModal(subscription: Subscription): void {
    this.currentSubscription = subscription;

    this.currentPermissions = this.parseAuthorization(
      subscription.autorisation || ''
    );

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('permissionModal')
    );
    modal.show();
  }

  savePermissions(): void {
    if (!this.currentSubscription || !this.currentSubscription.id) return;

    const updatedAuth = Object.entries(this.currentPermissions)
      .map(([key, val]) => `${key}:${val ?? 0}`)
      .join(',');

    const updatedSubscription: Subscription = {
      ...this.currentSubscription,
      autorisation: updatedAuth,
    };

    this.subscriptionService
      .updateSubscription(this.currentSubscription.id, updatedSubscription)
      .subscribe({
        next: () => {
          this.successMessage = 'Permissions mises à jour avec succès';
          this.loadSubscriptions();
          this.closeModal('permissionModal');
          this.hideMessageAfterDelay();
        },
        error: () => {
          this.errorMessage =
            'Erreur lors de la mise à jour des permissions.';
          this.hideMessageAfterDelay();
        },
      });
  }

  parseAuthorization(authString: string): any {
    if (!authString) return {};

    return Object.fromEntries(
      authString.split(',').map((pair) => {
        const [key, val] = pair.split(':');
        return [key, Number(val)];
      })
    );
  }

  onPermissionToggle(key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newSubscriptionPermissions[key] = input.checked ? 1 : 0;
  }

  // ================= UTIL =================

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) {
      (window as any).bootstrap.Modal.getInstance(modal)?.hide();
    }
  }

  hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 4000);
  }
}*/