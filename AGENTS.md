# Project afspraken

- Rond wijzigingen af op GitHub én op de VPS; alleen lokaal aanpassen is niet voldoende. De gebruiker heeft dit als vaste werkwijze gevraagd.
- Laat GitHub Actions de tests, build en GitHub Release uitvoeren. Maak releases niet handmatig aan en wacht op een geslaagde workflow voordat je de release uitrolt.
- Gebruik opeenvolgende SemVer-versies: patch voor fixes, minor voor nieuwe functies, major voor wijzigingen die bestaande gebruikers raken. Houd package.json, package-lock.json, de assetversies in src/index.html, CHANGELOG.md en de releasetag gelijk. Sla geen patch-, minor- of majorstap over.
- Schrijf korte, concrete commitberichten en releasebeschrijvingen in de bestaande projectstijl. Beschrijf wat er voor de gebruiker verandert; vermijd promotietaal, standaardvulling en verwijzingen naar de werksessie. Voeg geen verzonnen persoonlijke claims toe.
- VPS: ubuntu@134.98.141.237, checkout /opt/docker/apps/onionsimgeditor, container/service onionsimgeditor, URL https://onionsimgeditor.mr-onion.nl.
- De editor hoort bij het gedeelde Compose-project /opt/docker. Gebruik de bestaande /opt/docker/.env en /opt/docker/compose.yaml met profiel all. Werk alleen onionsimgeditor bij met --no-deps en COMPOSE_REMOVE_ORPHANS=false. Bewaar lokale VPS-configuratie en controleer na uitrol de containerhealth, het versienummer en de publieke URL.
