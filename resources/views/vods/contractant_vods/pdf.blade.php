{{-- resources/views/pdf/vod_contractant.blade.php --}}
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>VOD #{{ $vod->id }}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 10pt; color:#000; line-height:1.4; }

    .muted { color:#000; font-style: italic; font-size: 8pt; }

    .box {
      border:1px solid #000;
      padding:10px;
      margin-bottom:12px;
      page-break-inside: avoid;
    }

    table { width:100%; border-collapse: collapse; margin-bottom:12px; page-break-inside: avoid; }
    th, td { border:1px solid #000; padding:6px; text-align:left; vertical-align: top; font-size:9pt; }

    /* Images */
    img { border:1px solid #000; }
    .photo-wide {
      display:block;
      max-width:100%;
      width:100%;
      height:auto;
      max-height:280px;
      margin:6px 0;
      object-fit: contain;
      border:1px solid #000;
    }

    /* --- Top bar --- */
    .topbar { width:100%; border:2px solid #000; margin-bottom:10px; }
    .topbar td { border:1px solid #000; padding:10px 12px; vertical-align:middle; }
    .topbar .logo { width:20%; text-align:center; }
    .topbar .title { width:60%; text-align:center; font-weight:bold; font-size:18pt; }
    .topbar .meta { width:20%; text-align:right; font-size:9pt; }

    .title-main { font-size:18pt; font-weight:bold; }

    /* Section bars */
    .section-bar {
      background:#000;
      color:#fff;
      text-align:center;
      font-weight:bold;
      padding:6px 10px;
      margin:22px 0 10px;
      font-size:11pt;
      page-break-inside: avoid;
    }
    .section-bar small { font-weight:normal; font-style:italic; font-size:8pt; }
  </style>
</head>
<body>
@php
    $emission = $vod->created_at
        ? \Carbon\Carbon::parse($vod->created_at)->format('d/m/Y')
        : now()->format('d/m/Y');

    $dateVisite = '—';
    $d = $vod->getAttribute('date');
    if ($d instanceof \Carbon\CarbonInterface) {
        $dateVisite = $d->format('d/m/Y');
    } elseif (!empty($d)) {
        try { $dateVisite = \Carbon\Carbon::parse($d)->format('d/m/Y'); }
        catch (\Throwable $e) { $dateVisite = (string)$d; }
    }
@endphp

<!-- Bandeau top -->
<table class="topbar">
  <tr>
    <td class="logo">
      <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="max-height:50px; border:none;">
    </td>
    <td class="title">
      <div class="title-main">VOD Contractant</div>
      <div>« Visites Observation et ronde HSE »</div>
    </td>
    <td class="meta">
      Date d’émission<br><strong>{{ $emission }}</strong>
    </td>
  </tr>
</table>

<!-- Informations -->
<div class="section-bar">Informations</div>
<table>
  <tr>
    <td><strong>Date :</strong> {{ $dateVisite }}</td>
<td><strong>Projet :</strong>
  {{ $vod->project?->name ?? $vod->projet ?? '—' }}
</td>

    <td><strong>Activité :</strong> {{ $vod->activite }}</td>
  </tr>
  <tr>
    <td><strong>Observateur :</strong> {{ $vod->observateur }}</td>
    <td><strong>Personnes observées :</strong>
      @if(!empty($vod->personnes_observees) && is_array($vod->personnes_observees))
        {{ implode(', ', $vod->personnes_observees) }}
      @else
        —
      @endif
    </td>
    <td><strong>Entreprises observées :</strong>
      @if(!empty($vod->entreprise_observee) && is_array($vod->entreprise_observee))
        {{ implode(', ', $vod->entreprise_observee) }}
      @else
        —
      @endif
    </td>
  </tr>
</table>

<!-- Bonnes pratiques -->
<div class="section-bar">Bonnes pratiques</div>
@if (!empty($vod->pratiques))
  <table>
    @foreach ($vod->pratiques as $p)
      <tr>
        <td><strong>Description</strong></td>
        <td>{{ $p['text'] ?? '' }}</td>
      </tr>
      @if (!empty($p['photo']))
        <tr>
          <td colspan="2">
            <img class="photo-wide" src="{{ public_path('storage/' . $p['photo']) }}" alt="">
          </td>
        </tr>
      @endif
    @endforeach
  </table>
@else
  <div class="muted">Aucune.</div>
@endif

<!-- Comportements dangereux -->
<div class="section-bar">Comportements dangereux</div>
@if (!empty($vod->comportements))
  <table>
    @foreach ($vod->comportements as $c)
      <tr>
        <td><strong>Type</strong></td>
        <td>{{ $c['type'] ?? '' }}</td>
      </tr>
      <tr>
        <td><strong>Description</strong></td>
        <td>{{ $c['description'] ?? '' }}</td>
      </tr>
      @if (!empty($c['photo']))
        <tr>
          <td colspan="2">
            <img class="photo-wide" src="{{ public_path('storage/' . $c['photo']) }}" alt="">
          </td>
        </tr>
      @endif
    @endforeach
  </table>
@else
  <div class="muted">Aucun.</div>
@endif

<!-- Conditions dangereuses -->
<div class="section-bar">Conditions dangereuses</div>
@php $conds = $vod->conditions ?? []; @endphp
@if (!empty($conds))
  <ul>
    @foreach ($conds as $k => $v)
      @if ($v) <li>{{ $k }}</li> @endif
    @endforeach
  </ul>
@else
  <div class="muted">Aucune.</div>
@endif

<!-- Actions correctives -->
<div class="section-bar">Actions correctives</div>
@php $corr = $vod->correctives ?? []; @endphp
@if (!empty($corr))
  @foreach ($corr as $k => $fields)
    <div class="box">
      <strong>{{ $k }}</strong><br>
      @if (!empty($fields['action'])) Action : {{ $fields['action'] }}<br>@endif
      @if (!empty($fields['responsable'])) Responsable : {{ $fields['responsable'] }}<br>@endif
      @if (!empty($fields['statut'])) Statut : {{ $fields['statut'] }}<br>@endif
      @if (!empty($fields['photo']))
        <img src="{{ public_path('storage/' . $fields['photo']) }}" class="photo-wide">
      @endif
    </div>
  @endforeach
@else
  <div class="muted">Aucune.</div>
@endif

</body>
</html>
