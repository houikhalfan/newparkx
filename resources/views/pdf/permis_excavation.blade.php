<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        th, td { border: 1px solid #000; padding: 4px; vertical-align: top; }
        .section-title {
            background: #0E8A5D;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            text-align: left;
            padding: 3px;
        }
        .checkbox { font-family: DejaVu Sans; }
        .header-green { background: #0E8A5D; color: white; font-weight: bold; text-align: center; }
    </style>
</head>
<body>
    {{-- HEADER --}}
    <table>
        <tr>
            <td rowspan="2" style="text-align:center; font-weight:bold; font-size:14px;">
                <img src="{{ public_path('images/logo.png') }}" height="25"><br>
                PERMIS D’EXCAVATION — CONSTRUCTION
            </td>
            <td class="header-green">NUMÉRO DE PERMIS GÉNÉRAL</td>
            <td>{{ $permis->numero_permis_general }}</td>
        </tr>
        <tr>
            <td class="header-green">NUMÉRO DE PERMIS</td>
            <td>{{ $permis->numero_permis }}</td>
        </tr>
    </table>

    {{-- IDENTIFICATION --}}
    <table>
        <tr><th colspan="4" class="section-title">IDENTIFICATION</th></tr>
        <tr>
            <td>Endroit / Plan</td><td>{{ $permis->site->name ?? '—' }}</td>
            <td>Durée</td><td>De {{ $permis->duree_de }} à {{ $permis->duree_a }}</td>
        </tr>
        <tr><td>Description du travail</td><td colspan="3">{{ $permis->description }}</td></tr>
        <tr>
            <td>Analyse des risques réalisée par</td><td>{{ $permis->analyse_par }}</td>
            <td>Date</td><td>{{ $permis->date_analyse }}</td>
        </tr>
        <tr>
            <td>Demandeur du permis</td><td>{{ $permis->demandeur }}</td>
            <td>Contractant effectuant le travail</td><td>{{ $permis->contractant }}</td>
        </tr>
    </table>

    {{-- DANGERS PARTICULIERS --}}
   <!-- DANGERS PARTICULIERS -->
<table>
    <tr class="section-title"><td colspan="3">DANGERS PARTICULIERS</td></tr>
    <tr>
        <td style="width:33%">
            <strong>L’excavation est :</strong><br>
            <div class="{{ $permis->danger_aucun ? 'checked' : 'unchecked' }} checkbox">Aucun danger particulier</div>
            <div style="{{ $permis->danger_aucun ? 'opacity:0.5' : '' }}">
                @foreach (['prof_12'=>'> 1,2 mètres de prof.',
                           'prof_18'=>'> 1,8 mètres de prof.',
                           'prof_30'=>'> 3,0 mètres de prof.',
                           'moins_3_rive'=>'< 3 m de la rive',
                           'moins_3_pente'=>'< 3 m d’une pente',
                           'moins_3_route'=>'< 3 m d’une route'] as $key=>$label)
                    <div class="{{ in_array($key, $permis->excavation_est ?? []) ? 'checked' : 'unchecked' }} checkbox">{{ $label }}</div>
                @endforeach
            </div>
        </td>
        <td style="width:33%">
            <strong>Conduites/Tuyauterie souterraine :</strong><br>
            <div style="{{ $permis->danger_aucun ? 'opacity:0.5' : '' }}">
                @foreach (['electrique'=>'Électrique', 'drainage'=>'Drainage', 'incendie'=>'Protection incendie', 'oleoduc'=>'Oléoduc',
                           'eau'=>"Conduite d'eau", 'procede'=>'Conduit de procédé', 'telecom'=>'Câbles téléphoniques', 'fibre'=>'Fibre optique',
                           'fondations'=>'Fondations / Infrastructures', 'bornes'=>'Bornes géodésiques', 'dynamitage'=>'Requiert dynamitage'] as $key=>$label)
                    <div class="{{ in_array($key, $permis->conduites ?? []) ? 'checked' : 'unchecked' }} checkbox">{{ $label }}</div>
                @endforeach
            </div>
        </td>
        <td style="width:33%">
            <strong>Situations dangereuses :</strong><br>
            <div style="{{ $permis->danger_aucun ? 'opacity:0.5' : '' }}">
                @foreach (['pluie'=>'Pluie abondante récemment', 'infiltration'=>"Infiltration d’eau", 'terrain'=>"Terrain instable", 'autre'=>"Autre"] as $key=>$label)
                    <div class="{{ in_array($key, $permis->situations ?? []) ? 'checked' : 'unchecked' }} checkbox">{{ $label }}</div>
                @endforeach
                @if($permis->situation_autre)
                    <div><em>Autre : {{ $permis->situation_autre }}</em></div>
                @endif
            </div>
        </td>
    </tr>
</table>

<!-- COMMENTAIRES -->
<table>
    <tr class="section-title"><td>COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES</td></tr>
    <tr>
        <td>
            <div class="{{ $permis->aucun_commentaire ? 'checked' : 'unchecked' }} checkbox">Aucun commentaire</div>
            @if(!$permis->aucun_commentaire)
                <p>{{ $permis->commentaires }}</p>
            @endif
        </td>
    </tr>
</table>

<!-- EQUIPEMENTS -->
<table>
    <tr class="section-title"><td>ÉQUIPEMENT DE PROTECTION</td></tr>
    <tr>
        <td>
            <div class="{{ $permis->equip_non_requis ? 'checked' : 'unchecked' }} checkbox">Équipement de protection additionnel non requis</div>
            <div style="{{ $permis->equip_non_requis ? 'opacity:0.5' : '' }}">
                @foreach (['stabilite'=>'Note de stabilité du terrain', 'revision_dessins'=>'Révision des dessins', 'identification_ouvrages'=>'Identification des ouvrages souterrains',
                           'barricades_signaux'=>"Barricades et signaux d’avertissement", 'barricades_11m'=>"Barricades 1,1 m si prof > 1,8 m",
                           'excavation_045'=>"Excavation manuelle < 0,45 m d’un conduit", 'degagement_06'=>"Dégagement 0,6 m paroi/équipement",
                           'vehicules_2m'=>"Véhicules interdits à < 2 m", 'empilement_12'=>"Pas d’empilement < 1,2 m", 'echelle_10m'=>"Échelle/rampe d’accès tous les 10 m",
                           'etayage'=>"Étayage"] as $key=>$label)
                    <div class="{{ in_array($key, $permis->equip_checks ?? []) ? 'checked' : 'unchecked' }} checkbox">{{ $label }}</div>
                @endforeach
                @if($permis->equip_autre)
                    <div><em>Autre : {{ $permis->equip_autre }}</em></div>
                @endif
            </div>
        </td>
    </tr>
</table>


    {{-- EPI --}}
    <table>
        <tr><th colspan="2" class="section-title">ÉQUIPEMENT DE PROTECTION PERSONNELLE (ÉPI) REQUIS</th></tr>
        <tr>
            <td>Sans ÉPI additionnel {{ $permis->epi_sans_additionnel ? '☑' : '☐' }}</td>
            <td>
                Harnais de retenue {{ in_array('harnais', $permis->epi_simples ?? []) ? '☑' : '☐' }}<br>
                Autre : {{ $permis->epi_autre ?? '—' }}
            </td>
        </tr>
    </table>

    {{-- ÉQUIPEMENT DE PROTECTION --}}
    <table>
        <tr><th class="section-title">ÉQUIPEMENT DE PROTECTION</th></tr>
        <tr><td>
            Non requis {{ $permis->equip_non_requis ? '☑' : '☐' }}<br>
            @foreach (['stabilite'=>'Note de stabilité du terrain','revision_dessins'=>'Révision des dessins','identification_ouvrages'=>'Identification ouvrages','barricades_signaux'=>'Barricades & signaux','barricades_11m'=>'Barricades 1,1m si prof>1,8m','excavation_045'=>'Excavation manuelle <0,45m conduit','degagement_06'=>'Dégagement 0,6m','vehicules_2m'=>'Véhicules interdits <2m','empilement_12'=>'Pas empilement <1,2m','echelle_10m'=>'Échelle/rampe chaque 10m','etayage'=>'Étayaage'] as $k => $label)
                <div class="checkbox">{{ in_array($k, $permis->equip_checks ?? []) ? '☑' : '☐' }} {{ $label }}</div>
            @endforeach
            Autre : {{ $permis->equip_autre ?? '—' }}
        </td></tr>
    </table>

    {{-- COMMENTAIRES --}}
    <table>
        <tr><th class="section-title">COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES</th></tr>
        <tr>
            <td>
                Aucun commentaire {{ $permis->aucun_commentaire ? '☑' : '☐' }}<br>
                Commentaires : {{ $permis->commentaires ?? '—' }}
            </td>
        </tr>
    </table>

    {{-- PROPRIÉTAIRE DES LIEUX --}}
    <table>
        <tr><th colspan="3" class="section-title">PROPRIÉTAIRE DES LIEUX</th></tr>
        <tr>
            <td>Nom : {{ $permis->proprietaire_nom }}</td>
            <td>Date : {{ $permis->proprietaire_date }}</td>
            <td>
                @if($permis->proprietaire_signature)
                    <img src="{{ public_path('storage/'.$permis->proprietaire_signature) }}" height="40">
                @endif
            </td>
        </tr>
    </table>

    {{-- SIGNATURES AUTORISATION --}}
    <table>
        <tr><th colspan="3" class="section-title">SIGNATURES D’AUTORISATION DU PERMIS</th></tr>
        <tr>
            <td>Responsable construction (Contractant)</td>
            <td>{{ $permis->sig_resp_construction_nom }}<br>Date : {{ $permis->sig_resp_construction_date }}</td>
            <td>
                @if($permis->sig_resp_construction_file)
                    <img src="{{ public_path('storage/'.$permis->sig_resp_construction_file) }}" height="40">
                @endif
            </td>
        </tr>
        <tr>
            <td>Responsable HSE (Contractant)</td>
            <td>{{ $permis->sig_resp_hse_nom }}<br>Date : {{ $permis->sig_resp_hse_date }}</td>
            <td>
                @if($permis->sig_resp_hse_file)
                    <img src="{{ public_path('storage/'.$permis->sig_resp_hse_file) }}" height="40">
                @endif
            </td>
        </tr>
    </table>
    <!-- ================== FERMETURE DU PERMIS ================== -->
<table width="100%" border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; margin-top:20px;">
    <tr style="background:#0E8A5D; color:white;">
        <td colspan="3"><strong>FERMETURE DU PERMIS</strong></td>
    </tr>
    <tr>
        <td colspan="3" style="font-size:12px; text-align:center; padding:10px;">
            <em>À remplir par ParkX (Construction Manager & HSE Manager) après la fin des travaux</em>
        </td>
    </tr>
    <tr>
        <td style="width:60%">✔ Le personnel assigné a été avisé que le travail est complété.</td>
        <td style="width:20%">[  ] Oui</td>
        <td style="width:20%">[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Les barricades et signaux d’avertissement ont été enlevés.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Les matériaux, outils et équipements ont été retirés.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ L’excavation a été remblayée.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Les dessins ont été mis à jour.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Suivi additionnel requis (préciser) :</td>
        <td colspan="2">________________________________________</td>
    </tr>
    <tr>
        <td><strong>Responsable construction ParkX</strong><br>Nom : ____________ <br>Date : _______ <br>Signature : _________</td>
        <td colspan="2"><strong>Responsable HSE ParkX</strong><br>Nom : ____________ <br>Date : _______ <br>Signature : _________</td>
    </tr>
</table>


    {{-- FOOTER --}}
    <p style="font-size:10px;">
        Document généré le {{ now()->format('Y-m-d H:i') }} <br>
        <b>Statut actuel :</b> {{ strtoupper($permis->status) }}
    </p>
</body>
</html>
