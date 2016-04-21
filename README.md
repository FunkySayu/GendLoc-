# GendLoc- (Gendloc++)

Gendloc++ est une application visant à étendre les fonctionnalités
de l'application Gendloc développée la Gendarmerie Nationale.

## Fonctionnalités

- envoi d'un flux vidéo/audio de la personne sur les lieux (victime, témoin, gendarme, ...) à l'opérateur
- envoi de photo de la personne sur les lieux à l'opérateur en cas de faible connexion ne permettant pas la vidéo
- envoi de fiches réflexes de l'opérateur à la victime/témoin afin de fournir un support visuel aux directives orales

### Reste à implémenter

- notification des opérateurs lors de la réception d'une photo d'une personne sur les lieux
- affichage des photos prises par la personne sur les lieux dans l'interface pour consultation
- mise en place d'une base de données pour le stockage des méta-données sur les fiches réflexes
- intégration du module Gendloc (envoi de position GPS et affichage sur la Google Maps)
- gestion de mot de passe pour les opérateurs

## Installation

### Utilisation de Vagrand

Pour une installation avec Vagrand, vous devez télécharger le fichier `Vagrantfile` puis lancer la commande suivante :
  
    $ vagrand up
  
Cette commande lancera automatiquement le serveur sur le port 8081.
  
### Sans Vagrand

Voici la procédure d'installation de notre projet sans utiliser Vagrand.

Pensez à mettre à jour et installer les paquets nécessaires avec de commencer :

    $ sudo apt-get update
    $ sudo apt-get -y install build-essential libssl-dev
  
Installez `nvm` si vous souhaitez conserver votre environnement NodeJS tout en ayant notre application fonctionnelle :

    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
    $ source ~/.nvm/nvm.sh
    $ nvm install 5

Téléchargez notre projet :

    $ git clone https://github.com/FunkySayu/GendLoc-.git

Installez les modules de NodeJS sur le frontend et le backend (chacune des commandes est lancée à la racine du projet :

    $ cd front && npm install
    $ cd back && npm install

## Lancement et utilisation

Lancez le serveur (dans le dossier `back/`) :

    $ node .
  
Pour se connecter en tant qu'opérateur, accéder à l'URL suivante : [Interface Opérateur](http://localhost:8081/ "Adresse de l'interface opérateur")

Pour se connecter en tant que personne sur les lieux, accéder à l'URL suivante (le numéro à la fin représente l'identifiant de la personne sur les lieux) : [Interface personne sur les lieux](http://localhost:8081/app/#/client/0612457889 "Adresse de l'interface personne sur les lieux avec numéro factice")

## Limitations

### Compatibilité

Les fonctionnalités de notre application sont disponibles sur tous les navigateurs pour les échanges de photos et fiches réflexes.

Les utilisateurs d'iOS et Safari ne peuvent envoyer de flux vidéo dû à une incompatibilité de la librairie WebRTC.

Les utilisateurs du navigateur Google Chrome pourront partager leur caméra/microphone qu'avec des serveurs sécurisés (Protocol HTTPS).

### Sécurité

Nous utilisons actuellement un serveur STUN de Google pour les salles de communication vidéo. Veuillez mettre en place votre propre serveur STUN pour que les communications soient privées.

Actuellement, aucun mot de passe n'est nécessaire pour se connecter à l'interface opérateur.

# Licence

Copyright (C) 2016 Axel Martin, Titouan Bion, Damien Cassan, Luc Charpentier

This program is free software: you can redistribute it and/or modify  
it under the terms of the GNU General Public License as published by  
the Free Software Foundation, either version 3 of the License, or  
(at your option) any later version.  

This program is distributed in the hope that it will be useful,  
but WITHOUT ANY WARRANTY; without even the implied warranty of  
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  
GNU General Public License for more details.  

You should have received a copy of the GNU General Public License  
along with this program.  If not, see <http://www.gnu.org/licenses/>.  


