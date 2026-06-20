/* ═══════════════════════════════════════════════════════════
   PARCHE DE TRADUCCIÓN — Mercedes-Benz Canada CRM/PRM
   Cargar este archivo DESPUÉS de i18n.js y DESPUÉS de app.js
   (sustituye/extiende funciones existentes, no las borra)
═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. NUEVAS LLAVES DE TRADUCCIÓN (EN / ES / FR)
   Se agregan a los objetos i18n.en, i18n.es, i18n.fr ya
   existentes con Object.assign, sin tocar lo que ya había.
────────────────────────────────────────────────────────── */
(function () {
  if (typeof i18n === 'undefined') {
    console.error('i18n-translations-patch.js debe cargarse después de i18n.js');
    return;
  }

  Object.assign(i18n.en, {
    // Estados genéricos (servicios / interacciones / citas)
    status_completed: 'Completed',
    status_scheduled: 'Scheduled',
    status_resolved: 'Resolved',
    status_open: 'Open',
    status_in_progress: 'In Progress',
    status_cancelled: 'Cancelled',
    cost_tbd: 'TBD',
    cost_complimentary: 'Complimentary',

    // Tipos de servicio (datos demo del cliente)
    svc_type_annual_inspection: 'Annual Inspection',
    svc_type_ota_tire_rotation: 'OTA Update & Tire Rotation',
    svc_type_brake_fluid_service: 'Brake Fluid Service',
    svc_type_pre_lease_inspection: 'Pre-Lease End Inspection',
    svc_type_oil_change_inspection: 'Oil Change & Inspection',

    // Asuntos de interacciones (soporte)
    int_subject_lease_renewal_inquiry: 'Lease renewal inquiry',
    int_subject_eqs_charging_optimization: 'EQS charging optimization',
    int_subject_service_appointment_booking: 'Service appointment booking',

    // Opciones del selector de soporte
    opt_service_inquiry: 'Service Inquiry',
    opt_lease_question: 'Lease Question',
    opt_vehicle_issue: 'Vehicle Issue',
    opt_other: 'Other',

    // Hitos / hotspots no traducidos
    cold_weather_impact_title: 'Cold Weather Impact',
    cold_weather_impact_msg: 'Battery efficiency at {efficiency}% due to cold temperatures',
    milestone_km_remaining: '{km} remaining',
    milestone_250k: '250K km',

    // Página de Beneficios
    ben_tag_amg: 'AMG Event',
    ben_tag_eq: 'EQ Community',
    ben_tag_vip: 'VIP',
    ben_tag_offer: 'Exclusive Offer',
    ben_tag_eq_experience: 'EQ Experience',
    ben_tag_suv: 'SUV Event',
    ben_label_amg: 'AMG Exclusive',
    ben_label_eq: 'EQ Owners',
    ben_label_premier: 'Premier Members',
    ben_label_offer: 'Service Offer',
    ben_label_experience: 'MB Experience',
    ben_label_adventure: 'Adventure Series',
    ben_title_amg_track: 'AMG Track Experience — Mosport',
    ben_desc_amg_track: 'An exclusive day on track with AMG performance vehicles. Instructors provided.',
    ben_title_eq_summit: 'EQ Charging Summit — Montreal',
    ben_desc_eq_summit: 'Join fellow EV owners for a deep-dive on charging infrastructure and range optimization.',
    ben_title_gala: 'MB Canada Gala — Toronto',
    ben_desc_gala: "Annual celebration of excellence for Mercedes-Benz Canada's top clients.",
    ben_title_detailing: 'Complimentary Detailing Package',
    ben_desc_detailing: 'Exclusive offer for lease clients: one complimentary premium interior & exterior detail.',
    ben_date_detailing: 'Valid until Dec 2026',
    ben_title_eq_tour: 'EQ World Tour — Vancouver',
    ben_desc_eq_tour: 'Experience the full EQ lineup in a guided tour across scenic BC routes.',
    ben_title_gle: 'GLE Off-Road Challenge',
    ben_desc_gle: 'Discover the limits of your GLE with expert 4×4 trails in the Rockies.'
  });

  Object.assign(i18n.es, {
    status_completed: 'Completado',
    status_scheduled: 'Programado',
    status_resolved: 'Resuelto',
    status_open: 'Abierto',
    status_in_progress: 'En progreso',
    status_cancelled: 'Cancelado',
    cost_tbd: 'Por confirmar',
    cost_complimentary: 'Cortesía',

    svc_type_annual_inspection: 'Inspección anual',
    svc_type_ota_tire_rotation: 'Actualización OTA y rotación de neumáticos',
    svc_type_brake_fluid_service: 'Servicio de líquido de frenos',
    svc_type_pre_lease_inspection: 'Inspección previa al fin de contrato',
    svc_type_oil_change_inspection: 'Cambio de aceite e inspección',

    int_subject_lease_renewal_inquiry: 'Consulta de renovación de contrato',
    int_subject_eqs_charging_optimization: 'Optimización de carga del EQS',
    int_subject_service_appointment_booking: 'Reserva de cita de servicio',

    opt_service_inquiry: 'Consulta de servicio',
    opt_lease_question: 'Pregunta sobre el arrendamiento',
    opt_vehicle_issue: 'Problema del vehículo',
    opt_other: 'Otro',

    cold_weather_impact_title: 'Impacto del clima frío',
    cold_weather_impact_msg: 'Eficiencia de la batería al {efficiency}% debido a las bajas temperaturas',
    milestone_km_remaining: 'faltan {km}',
    milestone_250k: '250K km',

    ben_tag_amg: 'Evento AMG',
    ben_tag_eq: 'Comunidad EQ',
    ben_tag_vip: 'VIP',
    ben_tag_offer: 'Oferta exclusiva',
    ben_tag_eq_experience: 'Experiencia EQ',
    ben_tag_suv: 'Evento SUV',
    ben_label_amg: 'Exclusivo AMG',
    ben_label_eq: 'Propietarios EQ',
    ben_label_premier: 'Miembros Premier',
    ben_label_offer: 'Oferta de servicio',
    ben_label_experience: 'Experiencia MB',
    ben_label_adventure: 'Serie Aventura',
    ben_title_amg_track: 'Experiencia en pista AMG — Mosport',
    ben_desc_amg_track: 'Un día exclusivo en pista con vehículos de alto rendimiento AMG. Instructores incluidos.',
    ben_title_eq_summit: 'Cumbre de carga EQ — Montreal',
    ben_desc_eq_summit: 'Únase a otros propietarios de EV para profundizar en infraestructura de carga y optimización de autonomía.',
    ben_title_gala: 'Gala MB Canadá — Toronto',
    ben_desc_gala: 'Celebración anual de excelencia para los mejores clientes de Mercedes-Benz Canadá.',
    ben_title_detailing: 'Paquete de detallado de cortesía',
    ben_desc_detailing: 'Oferta exclusiva para clientes en contrato de arrendamiento: un detallado premium interior y exterior de cortesía.',
    ben_date_detailing: 'Válido hasta dic. 2026',
    ben_title_eq_tour: 'Gira mundial EQ — Vancouver',
    ben_desc_eq_tour: 'Experimente toda la gama EQ en un recorrido guiado por las rutas escénicas de BC.',
    ben_title_gle: 'Desafío off-road GLE',
    ben_desc_gle: 'Descubra los límites de su GLE con senderos 4×4 expertos en las Rocosas.'
  });

  Object.assign(i18n.fr, {
    status_completed: 'Terminé',
    status_scheduled: 'Planifié',
    status_resolved: 'Résolu',
    status_open: 'Ouvert',
    status_in_progress: 'En cours',
    status_cancelled: 'Annulé',
    cost_tbd: 'À déterminer',
    cost_complimentary: 'Gratuit',

    svc_type_annual_inspection: 'Inspection annuelle',
    svc_type_ota_tire_rotation: 'Mise à jour OTA et permutation des pneus',
    svc_type_brake_fluid_service: 'Service du liquide de frein',
    svc_type_pre_lease_inspection: 'Inspection de fin de contrat',
    svc_type_oil_change_inspection: "Changement d'huile et inspection",

    int_subject_lease_renewal_inquiry: 'Demande de renouvellement de contrat',
    int_subject_eqs_charging_optimization: 'Optimisation de la charge EQS',
    int_subject_service_appointment_booking: 'Réservation de rendez-vous de service',

    opt_service_inquiry: 'Demande de service',
    opt_lease_question: 'Question sur la location',
    opt_vehicle_issue: 'Problème de véhicule',
    opt_other: 'Autre',

    cold_weather_impact_title: 'Impact du froid',
    cold_weather_impact_msg: "Efficacité de la batterie à {efficiency}% en raison des basses températures",
    milestone_km_remaining: 'reste {km}',
    milestone_250k: '250K km',

    ben_tag_amg: 'Événement AMG',
    ben_tag_eq: 'Communauté EQ',
    ben_tag_vip: 'VIP',
    ben_tag_offer: 'Offre exclusive',
    ben_tag_eq_experience: 'Expérience EQ',
    ben_tag_suv: 'Événement VUS',
    ben_label_amg: 'Exclusif AMG',
    ben_label_eq: 'Propriétaires EQ',
    ben_label_premier: 'Membres Premier',
    ben_label_offer: 'Offre de service',
    ben_label_experience: 'Expérience MB',
    ben_label_adventure: 'Série Aventure',
    ben_title_amg_track: 'Expérience piste AMG — Mosport',
    ben_desc_amg_track: 'Une journée exclusive sur piste avec des véhicules de performance AMG. Instructeurs fournis.',
    ben_title_eq_summit: 'Sommet de charge EQ — Montréal',
    ben_desc_eq_summit: "Rejoignez d'autres propriétaires de VE pour explorer l'infrastructure de charge et l'optimisation de l'autonomie.",
    ben_title_gala: 'Gala MB Canada — Toronto',
    ben_desc_gala: "Célébration annuelle de l'excellence pour les meilleurs clients de Mercedes-Benz Canada.",
    ben_title_detailing: 'Forfait de détaillage gratuit',
    ben_desc_detailing: 'Offre exclusive pour les les locataires : un détaillage premium intérieur et extérieur gratuit.',
    ben_date_detailing: "Valide jusqu'en déc. 2026",
    ben_title_eq_tour: 'Tournée mondiale EQ — Vancouver',
    ben_desc_eq_tour: 'Découvrez toute la gamme EQ lors d\'une visite guidée sur les routes pittoresques de la C.-B.',
    ben_title_gle: 'Défi hors route GLE',
    ben_desc_gle: 'Découvrez les limites de votre GLE sur des pistes 4×4 expertes dans les Rocheuses.'
  });

  /* ──────────────────────────────────────────────────────────
     2. HELPERS DE TRADUCCIÓN DE DATOS (no de UI estática)
  ────────────────────────────────────────────────────────── */
  const SERVICE_TYPE_KEY_MAP = {
    'Annual Inspection': 'svc_type_annual_inspection',
    'OTA Update & Tire Rotation': 'svc_type_ota_tire_rotation',
    'Brake Fluid Service': 'svc_type_brake_fluid_service',
    'Pre-Lease End Inspection': 'svc_type_pre_lease_inspection',
    'Oil Change & Inspection': 'svc_type_oil_change_inspection'
  };
  const INTERACTION_SUBJECT_KEY_MAP = {
    'Lease renewal inquiry': 'int_subject_lease_renewal_inquiry',
    'EQS charging optimization': 'int_subject_eqs_charging_optimization',
    'Service appointment booking': 'int_subject_service_appointment_booking'
  };
  const STATUS_KEY_MAP = {
    'Completed': 'status_completed',
    'Scheduled': 'status_scheduled',
    'Resolved': 'status_resolved',
    'Open': 'status_open',
    'In Progress': 'status_in_progress',
    'Cancelled': 'status_cancelled'
  };

  window.trService = function (type) {
    const key = SERVICE_TYPE_KEY_MAP[type];
    return key ? t(key) : type;
  };
  window.trSubject = function (subject) {
    const key = INTERACTION_SUBJECT_KEY_MAP[subject];
    return key ? t(key) : subject;
  };
  window.trStatus = function (status) {
    const key = STATUS_KEY_MAP[status];
    return key ? t(key) : status;
  };

  /* ──────────────────────────────────────────────────────────
     3. OVERRIDE: renderClienteHistory — Historial de servicio
  ────────────────────────────────────────────────────────── */
  window.renderClienteHistory = function () {
    const c = CLIENTS[0];
    const svcs = [...c.services].sort((a, b) => new Date(b.date) - new Date(a.date));

    document.getElementById('main-content').innerHTML = `
    <div class="panel-section">
      <div class="page-header">
        <div class="page-title">${t('page_history_title')}</div>
        <div class="page-sub">${c.vehicle.model} · ${svcs.length} ${t('records')}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn--primary btn--sm" onclick="exportServiceHistoryCSV()" style="display:flex;align-items:center;gap:6px;justify-content:center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${t('export_csv')}
        </button>
        <button class="btn btn--ghost btn--sm" onclick="exportClientReportPDF()" style="display:flex;align-items:center;gap:6px;justify-content:center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${t('export_report')}
        </button>
      </div>
    </div>
    <div class="panel-section">
      <div class="card">
        <div class="card-body">
          <div class="timeline">
            ${svcs.map(s => {
              const dot = s.status === 'Completed' ? 'success' : s.status === 'Scheduled' ? 'warning' : 'muted';
              const cost = s.cost === 0 ? t('cost_complimentary') : s.cost ? fmtMoney(s.cost) : t('cost_tbd');
              return `<div class="timeline-item">
                <div class="timeline-dot timeline-dot--${dot}"></div>
                <div class="timeline-content">
                  <div class="timeline-title">${trService(s.type)}</div>
                  <div class="timeline-sub">${s.dealer}</div>
                  <div class="timeline-sub" style="margin-top:4px;">${badge(trStatus(s.status), dot === 'success' ? 'success' : dot === 'warning' ? 'warning' : 'silver')} · ${cost}</div>
                </div>
                <div class="timeline-date">${fmtDate(s.date)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
  };

  /* ──────────────────────────────────────────────────────────
     4. OVERRIDE: renderClienteSupport — Soporte
  ────────────────────────────────────────────────────────── */
  window.renderClienteSupport = function () {
    const c = CLIENTS[0];
    document.getElementById('main-content').innerHTML = `
    <div class="panel-section">
      <div class="page-header"><div class="page-title">${t('page_sup_title')}</div><div class="page-sub">${t('page_sup_sub')} · Mercedes-Benz Montreal</div></div>
    </div>
    <div class="panel-section">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span class="card-title">${t('contact_advisor')}</span></div>
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
              <div class="avatar avatar--lg" style="background:var(--blue);">MT</div>
              <div><div style="font-weight:500;color:var(--text-100);">Marc Tremblay</div><div class="text-xs text-muted">${t('service_advisor')}</div><div class="text-xs text-muted">Mercedes-Benz Montreal</div></div>
            </div>
            <div class="form-group mb-12">
              <label class="form-label">${t('subject')}</label>
              <select class="form-select">
                <option>${t('opt_service_inquiry')}</option>
                <option>${t('opt_lease_question')}</option>
                <option>${t('opt_vehicle_issue')}</option>
                <option>${t('opt_other')}</option>
              </select>
            </div>
            <div class="form-group mb-12">
              <label class="form-label">${t('message')}</label>
              <textarea class="form-textarea" placeholder="${t('message_ph')}"></textarea>
            </div>
            <button class="btn btn--primary w-full" style="justify-content:center;" onclick="alert('Message sent! Your advisor will respond within 2 hours.')">${t('send_message')}</button>
            <div style="margin-top:10px;text-align:center;"><a href="tel:+15148923000" class="btn btn--ghost btn--sm w-full" style="justify-content:center;">📞 ${t('call_dealer')}</a></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">${t('recent_interactions')}</span></div>
          <div class="card-body--sm">
            ${c.interactions.map(i => {
              const cls = { Email: 'email', Call: 'call', App: 'app', Visit: 'visit' };
              const badgeType = i.status === 'Resolved' ? 'success' : i.status === 'Open' ? 'warning' : 'silver';
              return `<div class="ticket-item">
                <div class="ticket-icon ticket-icon--${cls[i.type] || 'email'}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    ${i.type === 'Email' ? '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' :
                      i.type === 'Call' ? '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.57 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>' :
                      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'}
                  </svg>
                </div>
                <div class="ticket-content" style="flex:1">
                  <div class="ticket-title">${trSubject(i.subject)}</div>
                  <div class="ticket-meta">${i.type} · ${fmtDate(i.date)}</div>
                </div>
                ${badge(trStatus(i.status), badgeType)}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
  };

  /* ──────────────────────────────────────────────────────────
     5. OVERRIDE: renderClienteBenefits — Beneficios
  ────────────────────────────────────────────────────────── */
  function formatBenefitDate(iso) {
    const dt = new Date(iso + 'T00:00:00');
    return fmtDate(iso) === '—' ? iso : dt.toLocaleDateString(
      currentLanguage === 'es' ? 'es-CA' : currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  }

  window.renderClienteBenefits = function () {
    const events = [
      { icon: '🏎️', color: 'var(--amg-dim)', label: t('ben_label_amg'), title: t('ben_title_amg_track'), desc: t('ben_desc_amg_track'), date: formatBenefitDate('2026-08-14'), tag: t('ben_tag_amg'), tagClass: 'amg' },
      { icon: '⚡', color: 'var(--eq-dim)', label: t('ben_label_eq'), title: t('ben_title_eq_summit'), desc: t('ben_desc_eq_summit'), date: formatBenefitDate('2026-07-28'), tag: t('ben_tag_eq'), tagClass: 'eq' },
      { icon: '🥂', color: 'rgba(192,192,192,0.06)', label: t('ben_label_premier'), title: t('ben_title_gala'), desc: t('ben_desc_gala'), date: formatBenefitDate('2026-09-19'), tag: t('ben_tag_vip'), tagClass: 'silver' },
      { icon: '🛡️', color: 'var(--info-dim)', label: t('ben_label_offer'), title: t('ben_title_detailing'), desc: t('ben_desc_detailing'), date: t('ben_date_detailing'), tag: t('ben_tag_offer'), tagClass: 'info' },
      { icon: '🌍', color: 'rgba(30,58,95,0.2)', label: t('ben_label_experience'), title: t('ben_title_eq_tour'), desc: t('ben_desc_eq_tour'), date: formatBenefitDate('2026-10-04'), tag: t('ben_tag_eq_experience'), tagClass: 'suv' },
      { icon: '🏔️', color: 'rgba(109,40,217,0.1)', label: t('ben_label_adventure'), title: t('ben_title_gle'), desc: t('ben_desc_gle'), date: formatBenefitDate('2026-10-18'), tag: t('ben_tag_suv'), tagClass: 'sedan' }
    ];

    document.getElementById('main-content').innerHTML = `
    <div class="panel-section">
      <div class="page-header"><div class="page-title">${t('page_ben_title')}</div><div class="page-sub">${t('page_ben_sub')}</div></div>
    </div>
    <div class="panel-section">
      <div class="benefit-cards">
        ${events.map(ev => `
          <div class="benefit-card">
            <div class="benefit-card-img" style="background:${ev.color};font-size:3rem;">${ev.icon}</div>
            <div class="benefit-card-body">
              <div class="benefit-card-label" style="color:var(--text-400);">${ev.label}</div>
              <div class="benefit-card-title">${ev.title}</div>
              <div class="benefit-card-desc">${ev.desc}</div>
              <div class="benefit-card-date">📅 ${ev.date}</div>
              <div style="margin-top:10px;">${badge(ev.tag, ev.tagClass)}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  };

  /* ──────────────────────────────────────────────────────────
     6. OVERRIDE: viewAppointmentModal — usa trService / trStatus
  ────────────────────────────────────────────────────────── */
  window.viewAppointmentModal = function (id) {
    const svc = CLIENTS[0].services.find(s => s.id === id);
    if (!svc) return;
    const d = window.MOCK_APPT_DATA;

    const modalHtml = `
      <div class="modal-overlay" id="appt-view-modal" style="display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,26,0.85);backdrop-filter:blur(4px);z-index:9999;">
        <div class="modal-content" style="max-width:400px;width:90%;text-align:center;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="color:var(--text-primary);font-weight:600;font-size:1.4rem;margin:0;">${t('appt_details_title')}</h2>
            <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;" onclick="document.getElementById('appt-view-modal').remove()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="card" style="text-align:left;margin-bottom:16px;">
            <div class="card-body">
              <div class="text-sm" style="color:var(--text-100);font-weight:500;margin-bottom:16px;text-align:center;">${trService(svc.type)}</div>

              <div class="stat-row">
                <span class="stat-row-key">${t('date')}</span>
                <span class="stat-row-val">${fmtDate(svc.date)}</span>
              </div>
              <div class="stat-row">
                <span class="stat-row-key">${t('time')}</span>
                <span class="stat-row-val">${svc.time || '09:00'}</span>
              </div>
              <div class="stat-row">
                <span class="stat-row-key">${t('dealership')}</span>
                <span class="stat-row-val">${svc.dealer}</span>
              </div>
              <div class="stat-row" style="border-bottom:none;padding-bottom:0;">
                <span class="stat-row-key">${t('service_advisor')}</span>
                <span class="stat-row-val">${d.advisor}</span>
              </div>
            </div>
          </div>

          <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:24px;">${t('conf_number')}: <strong style="color:var(--text-primary);">${d.conf_number}</strong></p>

          <button class="btn btn--primary w-full" style="justify-content:center;" onclick="editAppointment('${svc.id}')">${t('update_appt')}</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  };

  /* Re-render activo cuando cambia el idioma para que las
     vistas de Historial, Soporte y Beneficios usen las
     versiones traducidas inmediatamente. */
  const _origChangeLanguage = window.changeLanguage;
  window.changeLanguage = function (lang) {
    _origChangeLanguage(lang);
  };
})();

/* ──────────────────────────────────────────────────────────
   8. OVERRIDE: renderClienteAppointment — tarjetas de cita
      programada con tipo/estado traducidos.
────────────────────────────────────────────────────────── */
(function () {
  const _origRenderClienteAppointment = window.renderClienteAppointment;
  window.renderClienteAppointment = function () {
    _origRenderClienteAppointment();
    const root = document.getElementById('main-content');
    if (!root) return;
    root.querySelectorAll('.card .text-sm').forEach(el => {
      const original = el.getAttribute('data-original') || el.textContent;
      if (window.SERVICE_TYPE_KEY_MAP_VALUES && window.SERVICE_TYPE_KEY_MAP_VALUES.includes(original)) {
        el.setAttribute('data-original', original);
        el.textContent = trService(original);
      }
    });
  };
})();

window.SERVICE_TYPE_KEY_MAP_VALUES = [
  'Annual Inspection',
  'OTA Update & Tire Rotation',
  'Brake Fluid Service',
  'Pre-Lease End Inspection',
  'Oil Change & Inspection'
];

/* ──────────────────────────────────────────────────────────
   9. OVERRIDE: renderClienteHome — traduce el tipo de
      servicio mostrado en "Próxima cita" de la pantalla
      de inicio.
────────────────────────────────────────────────────────── */
(function () {
  const _origRenderClienteHome = window.renderClienteHome;
  window.renderClienteHome = function () {
    _origRenderClienteHome();
    const root = document.getElementById('main-content');
    if (!root) return;
    root.querySelectorAll('.card-body .text-sm').forEach(el => {
      const txt = el.textContent.trim();
      if (window.SERVICE_TYPE_KEY_MAP_VALUES.includes(txt)) {
        el.textContent = trService(txt);
      }
    });
  };
})();

/* ──────────────────────────────────────────────────────────
   10. NUEVAS LLAVES — sufijo de hitos (milestones)
────────────────────────────────────────────────────────── */
(function () {
  Object.assign(i18n.en, {
    milestone_remaining_suffix: 'km remaining'
  });
  Object.assign(i18n.es, {
    milestone_remaining_suffix: 'km restantes'
  });
  Object.assign(i18n.fr, {
    milestone_remaining_suffix: 'km restants'
  });
})();

/* ──────────────────────────────────────────────────────────
   11. OVERRIDE: renderMilestones (dashboard.js)
────────────────────────────────────────────────────────── */
window.renderMilestones = function (mileage) {
  const milestones = [250000, 500000, 1000000];
  const nextMilestone = milestones.find(m => m > mileage);

  if (!nextMilestone) {
    return `<p style="color: var(--text-400); font-size: 0.85rem; padding: 16px; text-align: center;">
      [★] ${t('no_milestones')}
    </p>`;
  }

  const kmToNext = nextMilestone - mileage;

  return `
    <div class="milestone-badge">
      <div class="milestone-icon">✦</div>
      <div class="milestone-info">
        <div class="milestone-title">${t('unlock_next')}</div>
        <div class="milestone-desc">${(nextMilestone / 1000).toFixed(0)}K km</div>
        <div class="milestone-progress">${kmToNext.toLocaleString()} ${t('milestone_remaining_suffix')}</div>
      </div>
    </div>
  `;
};

/* ──────────────────────────────────────────────────────────
   12. OVERRIDE: renderAlertsSection (dashboard.js)
────────────────────────────────────────────────────────── */
window.renderAlertsSection = function (vehicle) {
  const alerts = [];

  // Alerta de neumáticos de temporada
  if (vehicle.components.tires.current_set === 'summer' && new Date().getMonth() >= 10) {
    alerts.push({
      type: 'info',
      title: t('alert_seasonal'),
      message: t('alert_seasonal_winter'),
      icon: 'info'
    });
  }

  // Servicio próximo
  if (vehicle.nextService) {
    const serviceDate = new Date(vehicle.nextService);
    const daysUntilService = Math.floor((serviceDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilService < 30 && daysUntilService > 0) {
      alerts.push({
        type: 'warning',
        title: t('alert_maintenance'),
        message: t('alert_service_due_in').replace('{days}', daysUntilService),
        icon: 'warning'
      });
    }
  }

  // Riesgo de corrosión (post-invierno en Canadá)
  if (vehicle.components.brakes.corrosion_risk || vehicle.components.suspension.corrosion_risk) {
    alerts.push({
      type: 'warning',
      title: t('alert_corrosion'),
      message: t('alert_corrosion_msg'),
      icon: 'warning'
    });
  }

  // Eficiencia en frío para EV/híbridos
  if (vehicle.tipo_vehiculo === 'electrico' || vehicle.tipo_vehiculo === 'hibrido') {
    if (vehicle.battery && vehicle.battery.coldEfficiency < 0.90) {
      const efficiency = (vehicle.battery.coldEfficiency * 100).toFixed(0);
      alerts.push({
        type: 'info',
        title: t('cold_weather_impact_title'),
        message: t('cold_weather_impact_msg').replace('{efficiency}', efficiency),
        icon: 'info'
      });
    }
  }

  if (alerts.length === 0) {
    return `<div style="text-align: center; padding: 24px; color: var(--text-400);">
      <p style="font-size: 0.9rem;">[✓] ${t('alert_no_alerts')}</p>
    </div>`;
  }

  return alerts.map(alert => {
    let iconSvg = alert.icon;
    if (alert.icon === 'warning') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="color:var(--warning)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else if (alert.icon === 'info') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="color:var(--info)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    } else if (alert.icon === 'danger') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="color:var(--danger)"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }
    return `
    <div class="alert-item alert-item--${alert.type}">
      <div class="alert-icon">${iconSvg}</div>
      <div class="alert-content-item">
        <div class="alert-title">${alert.title}</div>
        <div class="alert-message">${alert.message}</div>
      </div>
    </div>
    `;
  }).join('');
};
