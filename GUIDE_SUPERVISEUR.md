# 📋 Guide du Superviseur - Système ANARE-CI

## 🎯 **Comment traiter les demandes en tant que superviseur**

### **1. Connexion et Rôles**

#### **Comptes de démonstration :**
- **Superviseur Recours** : `superviseur.recours@anare-ci.org` / `demo123`
- **Superviseur IT** : `superviseur.it@anare-ci.org` / `demo123`
- **Admin** : `admin@anare-ci.org` / `demo123`

#### **Permissions par rôle :**
- **Superviseur Recours** : Peut traiter uniquement les RECOURS
- **Superviseur IT** : Peut traiter uniquement les TICKETS
- **Admin** : Peut traiter les deux types

---

## 🔧 **Interface de Traitement**

### **Accès au traitement**
1. Connectez-vous avec un compte superviseur
2. Allez dans la section correspondante (Recours ou Tickets)
3. Cliquez sur "Détail" d'une demande en statut "En cours" ou "Nouveau"

### **Section "Décision Superviseur"**
Cette section apparaît automatiquement si :
- ✅ Vous êtes superviseur du bon type (Recours ou IT)
- ✅ La demande est en statut : `EN_COURS`, `NOUVEAU`, ou `EN_ATTENTE_VALIDATION`

---

## ⚡ **Actions Disponibles**

### **1. 🟢 VALIDER**
- **Usage** : Approuver la demande
- **Commentaire** : Optionnel
- **Résultat** : Statut → `VALIDE`

### **2. 🔴 REJETER**
- **Usage** : Refuser la demande
- **Motif** : **OBLIGATOIRE** - Expliquez clairement pourquoi
- **Résultat** : Statut → `REJETE`

### **3. 🟡 DEMANDER COMPLÉMENT**
- **Usage** : Demander des informations/documents supplémentaires
- **Précision** : **OBLIGATOIRE** - Listez ce qui manque
- **Résultat** : Statut → `EN_ATTENTE_VALIDATION`

### **4. ⚫ ANNULER**
- **Usage** : Annuler la demande (cas exceptionnel)
- **Motif** : **OBLIGATOIRE** - Justifiez l'annulation
- **Résultat** : Statut → `ANNULE`

---

## 📎 **Upload de Fichiers Justificatifs**

### **Formats acceptés :**
- 📄 PDF (.pdf)
- 📝 Word (.doc, .docx)
- 🖼️ Images (.jpg, .png)

### **Contraintes :**
- **Taille max** : 5MB par fichier
- **Quantité** : Illimitée
- **Usage** : Joindre des documents de validation, rejection, etc.

---

## 🔄 **Workflow de Traitement**

```
NOUVEAU/EN_COURS → [Action Superviseur] → STATUT_FINAL
```

### **Exemple concret :**
1. **Recours de facturation reçu** (statut: `EN_COURS`)
2. **Superviseur Recours se connecte**
3. **Clique sur "Détail"** → Section décision apparaît
4. **Choisit une action** (ex: Rejeter)
5. **Remplit le motif** : "Facture conforme, pas d'erreur détectée"
6. **Upload justificatif** (optionnel) : rapport_analyse.pdf
7. **Confirme** → Recours passe en `REJETE`
8. **Notification automatique** envoyée au demandeur

---

## 🎨 **Interface Visuelle**

### **Badges de permissions affichés :**
- 🟢 `Validation N1` - Peut valider niveau 1
- 🔵 `Validation N2` - Peut valider niveau 2  
- 🟣 `Réassignation` - Peut réassigner
- 🔴 `Fermeture` - Peut fermer

### **Actions rapides latérales :**
- **Escalader** - Vers niveau supérieur
- **Approuver** - Validation rapide
- **Rejeter** - Rejet rapide
- **Marquer résolu** - Finalisation
- **Réassigner** - Changement d'assignation
- **Fermer** - Fermeture définitive

---

## 🔒 **Sécurité et Traçabilité**

### **Chaque action est tracée :**
- ✅ Qui a fait l'action
- ✅ Quand elle a été faite
- ✅ Pourquoi (motif/commentaire)
- ✅ Fichiers joints

### **Historique complet :**
- Tous les commentaires horodatés
- Actions de décision marquées
- Documents uploadés référencés

---

## 🚀 **Pour tester le système**

1. **Connectez-vous** avec `superviseur.recours@anare-ci.org`
2. **Allez dans "Recours"**
3. **Cliquez "Détail"** sur un recours
4. **Vous verrez la section "Décision Superviseur"**
5. **Testez les différentes actions !**

---

## ❓ **FAQ**

**Q: Pourquoi je ne vois pas la section décision ?**
R: Vérifiez que vous êtes superviseur du bon type (Recours/IT) et que le statut permet le traitement.

**Q: Puis-je traiter les deux types de demandes ?**
R: Non, sauf si vous êtes Admin. Superviseur Recours = Recours uniquement, Superviseur IT = Tickets uniquement.

**Q: Le motif est-il vraiment obligatoire ?**
R: Oui, pour Rejeter et Annuler. Pour Valider et Demander complément, c'est selon le contexte.

---

✨ **Le système est maintenant prêt pour la supervision complète des recours et tickets !**
