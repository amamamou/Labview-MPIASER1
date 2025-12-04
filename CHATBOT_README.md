# 🤖 Chatbot WebLLM - Assistant Énergie

## ✅ Solution: WebLLM (100% Gratuit, Local, Sans API)

Le chatbot utilise **WebLLM** qui fait tourner un LLM directement dans le navigateur.

### 🎯 Avantages

- ✅ **100% gratuit** - Aucun coût, aucune limite d'API
- ✅ **Fonctionne localement** - Peut fonctionner offline après le premier chargement
- ✅ **Aucune clé API** - Pas de configuration externe nécessaire
- ✅ **Modèle léger** - Qwen2-1.5B-Instruct (optimisé pour la vitesse)
- ✅ **Instructions pré-injectées** - Le chatbot ne parle QUE d'énergie

### 🔧 Modèle utilisé

**Qwen2-1.5B-Instruct-q4f16_1**
- Modèle compact et rapide
- Optimisé pour le navigateur
- Quantifié en 4-bit pour réduire la taille
- Bon équilibre entre performance et précision

### 🎓 Instructions système

Le chatbot est configuré pour être un **expert en énergie solaire** avec les spécialisations suivantes:

#### ✅ Domaines supportés:
- Production d'énergie solaire et panneaux photovoltaïques
- Systèmes de stockage par batteries
- Optimisation et efficacité énergétique
- Analyse de données énergétiques CSV
- Prédictions de consommation et production
- Recommandations pour améliorer les performances
- Calculs de dimensionnement
- Valves électriques et transferts d'énergie
- Simulations LabVIEW

#### ❌ Refus automatique:
Si l'utilisateur pose une question hors énergie (politique, cuisine, sport, etc.), le bot répond:
> "Je suis un assistant spécialisé uniquement dans l'énergie solaire, les batteries et l'optimisation énergétique. Comment puis-je vous aider dans ce domaine?"

### 🚀 Utilisation

1. **Premier chargement**: Le modèle se télécharge automatiquement (~1GB)
   - Peut prendre 1-2 minutes selon la connexion
   - Le modèle est mis en cache dans le navigateur

2. **Statut visible**:
   - ⏳ **Chargement...** - Le modèle se télécharge
   - ✓ **Prêt** - Le chatbot est prêt à répondre
   - ⚠ **Erreur** - Problème de chargement (recharger la page)

3. **Conversation**:
   - Posez vos questions en français
   - Le bot répond de manière claire et professionnelle
   - Appuyez sur Enter ou cliquez sur "Envoyer"

### 💡 Exemples de questions

**Bonnes questions** (le bot répond):
- "Comment optimiser ma production solaire?"
- "Quelle capacité de batterie pour 5kW de panneaux?"
- "Comment fonctionne une valve électrique dans un système solaire?"
- "Explique-moi l'optimisation énergétique"
- "Analyse mes données de production CSV"

**Questions refusées** (hors énergie):
- "Quelle est la capitale de la France?" ❌
- "Recette de cuisine" ❌
- "Résultats sportifs" ❌

### 🔄 Améliorations futures possibles

1. **Modèle plus grand**: Utiliser Qwen2-7B pour plus de précision
   ```javascript
   "Qwen2-7B-Instruct-q4f16_1"
   ```

2. **Intégration avec données CSV**: 
   - Charger les données CSV dans le contexte
   - Permettre au chatbot d'analyser vos données réelles

3. **Historique de conversation**:
   - Sauvegarder dans localStorage
   - Reprendre une conversation précédente

4. **Export de recommandations**:
   - Télécharger les conseils du chatbot en PDF/TXT

### 📚 Ressources

- Documentation WebLLM: https://webllm.mlc.ai/
- Modèles disponibles: https://github.com/mlc-ai/web-llm#model-list
- GitHub WebLLM: https://github.com/mlc-ai/web-llm

### 🐛 Dépannage

**Le modèle ne se charge pas?**
- Vérifiez votre connexion internet (premier chargement uniquement)
- Essayez un autre navigateur (Chrome/Edge recommandés)
- Videz le cache du navigateur et rechargez

**Réponses lentes?**
- Normal sur la première requête (initialisation)
- Les requêtes suivantes sont plus rapides
- Considérez un modèle plus petit si nécessaire

**"Erreur lors du chargement"?**
- Rechargez la page
- Vérifiez que WebLLM est compatible avec votre navigateur
- Assurez-vous d'avoir au moins 4GB de RAM disponible

### ⚡ Performance

- **Première charge**: 1-2 minutes
- **Réponses**: 2-5 secondes par message
- **RAM utilisée**: ~2-3 GB
- **Cache navigateur**: ~1 GB

---

**Note**: Ce chatbot fonctionne entièrement dans votre navigateur. Vos conversations restent privées et ne sont jamais envoyées à un serveur externe.
