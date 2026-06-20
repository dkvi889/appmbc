/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Mercedes-Benz Dashboard - Component Management & Rendering
   Â© 2026 Mercedes-Benz Canada
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

'use strict';

// Component Icons (Professional SVG representations)
function getSVGIcon(componentKey) {
  const icons = {
    brakes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2"/></svg>`,
    tires: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 3v18M3 12h18"/></svg>`,
    suspension: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><line x1="5" y1="8" x2="5" y2="20"/><line x1="19" y1="8" x2="19" y2="20"/><line x1="5" y1="8" x2="19" y2="8"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="8" y1="4" x2="8" y2="8"/><line x1="16" y1="4" x2="16" y2="8"/></svg>`,
    battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M20 9v6"/><path d="M6 11v4"/><path d="M10 11v4"/><path d="M14 11v4"/></svg>`,
    oil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><path d="M6 4h12c1 0 1.5.5 1.5 1.5v6c0 2-1.5 3-1.5 6 0 2 .5 4.5-7.5 4.5s-7.5-2.5-7.5-4.5c0-3-1.5-4-1.5-6V5.5C4.5 4.5 5 4 6 4z"/><line x1="9" y1="10" x2="15" y2="10"/></svg>`,
    hvac: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><path d="M6 4h12c1 0 2 1 2 2v12c0 1-1 2-2 2H6c-1 0-2-1-2-2V6c0-1 1-2 2-2z"/><path d="M9 8v6M12 8v6M15 8v6"/><circle cx="6" cy="6" r="0.5" fill="currentColor"/></svg>`,
    motor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/><path d="M15 9l2-2M15 15l2 2M9 9l-2-2M9 15l-2 2"/></svg>`,
    transmission: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><rect x="5" y="5" width="14" height="14" rx="3"/><path d="M8 10h8M8 14h8M12 5v4M12 15v4"/></svg>`,
    charging: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><path d="M13 2H11v6h-6v2h6v6h2v-6h6v-2h-6z"/><circle cx="12" cy="12" r="10"/></svg>`,
    energy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"/></svg>`,
    cabin_filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h8"/><circle cx="12" cy="2" r="1" fill="currentColor"/></svg>`,
    engine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><circle cx="12" cy="12" r="8"/><path d="M12 6v12M6 12h12"/><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/></svg>`,
    electric_motor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><path d="M12 2v7M12 15v7"/><circle cx="12" cy="11" r="3"/><path d="M6 11l-4 0M22 11l-4 0"/><path d="M8 8l-2.83-2.83M18.83 18.83l-2.83-2.83M8 14l-2.83 2.83M18.83 5.17l-2.83 2.83"/></svg>`
  };
  return icons[componentKey] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="component-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
}

// Status level thresholds
const STATUS_LEVELS = {
  excellent: { min: 80, color: 'success', label: 'excellent' },
  good: { min: 60, color: 'info', label: 'good' },
  attention: { min: 40, color: 'warning', label: 'requires_attention' },
  critical: { min: 0, color: 'danger', label: 'critical' }
};

function getStatusLevel(percentage) {
  for (const [level, range] of Object.entries(STATUS_LEVELS)) {
    if (percentage >= range.min) return { level, ...range };
  }
  return { level: 'critical', color: 'danger', label: 'critical' };
}

const DIAGNOSTIC_QUICK_ACCESS_ITEMS = [
  { key: 'brakes', labelKey: 'comp_brakes', iconKey: 'brakes' },
  { key: 'tires', labelKey: 'comp_tires', iconKey: 'tires' },
  { key: 'suspension', labelKey: 'comp_suspension', iconKey: 'suspension' },
  { key: 'hvac', labelKey: 'comp_hvac', iconKey: 'hvac' },
  { key: 'engine', labelKey: 'comp_engine', iconKey: 'engine' },
  { key: 'battery', labelKey: 'comp_battery', iconKey: 'battery' },
  { key: 'transmission', labelKey: 'transmission', iconKey: 'transmission' },
  { key: 'energy', labelKey: 'energy_fuel', iconKey: 'energy' }
];

function resolveDiagnosticComponentKey(activeKey, vehicle) {
  if (activeKey === 'energy') {
    return vehicle.tipo_vehiculo === 'electrico' || vehicle.tipo_vehiculo === 'hibrido' ? 'battery' : 'oil';
  }
  return activeKey;
}

function renderDiagnosticDetail(vehicle, activeKey) {
  const componentKey = resolveDiagnosticComponentKey(activeKey, vehicle);
  const component = vehicle.components[componentKey] || {};
  const status = component.life !== undefined ? getStatusLevel(component.life) : { level: 'critical', color: 'danger', label: 'not_available' };
  const componentName = t(activeKey === 'energy'
    ? 'energy_fuel'
    : activeKey === 'transmission'
      ? 'transmission'
      : `comp_${activeKey}`);
  const detailItems = [];

  if (activeKey === 'brakes') {
    detailItems.push({ label: t('pad_thickness'), value: component.state || '4mm' });
    detailItems.push({ label: t('disc_condition'), value: t(component.corrosion_risk ? 'attention' : 'excellent') });
    detailItems.push({ label: t('fluid_moisture'), value: component.waterContent ? `${(component.waterContent * 100).toFixed(0)}%` : t('not_available') });
  } else if (activeKey === 'tires') {
    detailItems.push({ label: t('tread_depth'), value: component.treadDepth || t('not_available') });
    detailItems.push({ label: t('pressure_front'), value: component.pressureFront ? `${component.pressureFront} PSI` : t('not_available') });
    detailItems.push({ label: t('pressure_rear'), value: component.pressureRear ? `${component.pressureRear} PSI` : t('not_available') });
    detailItems.push({ label: t('season_current'), value: t(component.current_set === 'winter' ? 'winter' : 'summer') });
  } else if (activeKey === 'battery' || activeKey === 'energy') {
    const chargeLevel = component.chargeLevel || vehicle.battery?.chargeLevel || 84;
    const batteryHealth = component.health || vehicle.battery?.health || 96;
    const batteryRange = component.range || vehicle.battery?.estimatedRange || vehicle.battery?.range || 428;
    const batteryVoltage = component.voltage || 402;
    const batteryTemp = component.temperature || 18;
    detailItems.push({ label: t('charge_level'), value: `${chargeLevel}%` });
    detailItems.push({ label: t('battery_health'), value: `${batteryHealth}%` });
    detailItems.push({ label: t('battery_voltage'), value: `${batteryVoltage} V` });
    detailItems.push({ label: t('temperature_battery'), value: `${batteryTemp}°C` });
    detailItems.push({ label: t('estimated_range'), value: `${batteryRange} km` });
    detailItems.push({ label: t('charge_cycles'), value: component.cycles || t('not_available') });
  } else if (activeKey === 'suspension') {
    detailItems.push({ label: t('component_status'), value: component.state || t('not_available') });
    detailItems.push({ label: t('ride_quality'), value: component.rideQuality || t('good') });
    detailItems.push({ label: t('corrosion_risk'), value: component.corrosion_risk ? t('attention') : t('excellent') });
  } else if (activeKey === 'hvac') {
    detailItems.push({ label: t('climate_mode'), value: component.mode || t('not_available') });
    detailItems.push({ label: t('cabin_air_quality'), value: component.airQuality || t('good') });
    detailItems.push({ label: t('temperature_setpoint'), value: component.setpoint ? `${component.setpoint}°C` : t('not_available') });
  } else if (activeKey === 'engine') {
    detailItems.push({ label: t('horsepower'), value: vehicle.specs.horsepower || t('not_available') });
    detailItems.push({ label: t('torque'), value: vehicle.specs.torque || t('not_available') });
    detailItems.push({ label: t('displacement'), value: vehicle.specs.displacement || t('not_available') });
    detailItems.push({ label: t('oil_level'), value: component.state || t('not_available') });
  } else if (activeKey === 'transmission') {
    detailItems.push({ label: t('transmission'), value: vehicle.specs.transmission || t('not_available') });
    detailItems.push({ label: t('drive_mode'), value: component.driveMode || t('not_available') });
    detailItems.push({ label: t('shift_health'), value: component.shiftHealth || t('good') });
  }

  const statusLabel = status.label === 'not_available'
    ? t(status.label)
    : status.label === 'requires_attention'
      ? t('status_attention')
      : t(`status_${status.label}`);
  const evSummaryHtml = (vehicle.tipo_vehiculo === 'electrico' || vehicle.tipo_vehiculo === 'hibrido')
    ? `
      <div class="diag-hero-grid">
        <div class="diag-hero-card">
          <span class="diag-hero-label">${t('charge_level')}</span>
          <strong class="diag-hero-value">${vehicle.battery?.chargeLevel || t('not_available')}%</strong>
        </div>
        <div class="diag-hero-card">
          <span class="diag-hero-label">${t('estimated_range')}</span>
          <strong class="diag-hero-value">${vehicle.battery?.estimatedRange || vehicle.battery?.range || t('not_available')} km</strong>
        </div>
        <div class="diag-hero-card">
          <span class="diag-hero-label">${t('battery_health')}</span>
          <strong class="diag-hero-value">${vehicle.battery?.health || t('not_available')}%</strong>
        </div>
      </div>
    ` : '';

  return `
    <div class="diag-detail-content">
      <div class="diag-detail-header">
        <div>
          <div class="diag-detail-title">${componentName}</div>
          <div class="diag-detail-subtitle">${t('detail_overview')}</div>
        </div>
        <div class="status-pill status-pill--${status.color}">${statusLabel}</div>
      </div>
      ${evSummaryHtml}
      <div class="diag-detail-grid">
        <div class="diag-metric-block">
          <div class="diag-metric-label">${t('system_health')}</div>
          <div class="diag-metric-value">${component.life !== undefined ? `${component.life}%` : t('not_available')}</div>
          <div class="diag-metric-line"><div class="diag-metric-progress" style="width:${component.life || 0}%"></div></div>
        </div>
        <div class="diag-metric-group">
          ${detailItems.map(item => `
            <div class="diag-metric-row">
              <div class="diag-metric-label small">${item.label}</div>
              <div class="diag-metric-value small">${item.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderDiagnosticQuickAccess(vehicle, activeKey = 'brakes') {
  return `
    <div class="diag-shell">
      <div class="diag-shell-header">
        <div>
          <div class="diag-section-title">${t('diagnostics_title')}</div>
          <div class="diag-section-subtitle">${t('diagnostics_sub')}</div>
        </div>
        <div class="diag-shell-tag">${t('quick_access')}</div>
      </div>
      <div class="diag-access-grid">
        ${DIAGNOSTIC_QUICK_ACCESS_ITEMS.map(item => {
    const isActive = item.key === activeKey;
    const componentKey = resolveDiagnosticComponentKey(item.key, vehicle);
    const component = vehicle.components[componentKey] || {};
    const status = component.life !== undefined ? getStatusLevel(component.life) : { color: 'danger' };
    return `
            <button type="button" class="diag-control-button${isActive ? ' active' : ''}" data-component="${item.key}" onclick="openDiagnosticModal('${item.key}')">
              <span class="diag-icon-shell">
                ${getSVGIcon(item.iconKey)}
              </span>
              <span class="diag-access-label">${t(item.labelKey)}</span>
              <span class="diag-access-indicator diag-access-indicator--${status.color}"></span>
            </button>
          `;
  }).join('')}
      </div>
      <div class="diag-detail-panel" id="diag-detail-panel">
        ${renderDiagnosticDetail(vehicle, activeKey)}
      </div>
    </div>
  `;
}

function renderDiagnosticModal(vehicle, activeKey = 'brakes') {
  return `
    <div id="diag-modal-backdrop" class="diag-modal-backdrop" onclick="closeDiagnosticModal()">
      <div id="diag-modal" class="diag-modal" onclick="event.stopPropagation()">
        <button class="diag-modal-close" onclick="closeDiagnosticModal()" aria-label="${t('close')}">×</button>
        <div class="diag-modal-header">
          <div>
            <div class="diag-modal-title">${t('diagnostics_title')}</div>
            <div class="diag-modal-subtitle">${t('diagnostic_details_sub')}</div>
          </div>
          <div class="status-pill status-pill--info">${t('quick_access')}</div>
        </div>
        <div class="diag-modal-body">
          ${renderDiagnosticDetail(vehicle, activeKey)}
        </div>
      </div>
    </div>
  `;
}

window.openDiagnosticModal = function (activeKey) {
  const clientId = currentRole === 'cliente' ? CLIENTS[0].id : null;
  if (!clientId) return;
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) return;
  const vehicle = client.vehicle;
  closeDiagnosticModal();
  document.body.insertAdjacentHTML('beforeend', renderDiagnosticModal(vehicle, activeKey));
  document.body.style.overflow = 'hidden';
};

window.closeDiagnosticModal = function () {
  const backdrop = document.getElementById('diag-modal-backdrop');
  if (backdrop) backdrop.remove();
  document.body.style.overflow = '';
};

function renderComponentCard(componentKey, component, vehicleType) {
  const status = getStatusLevel(component.life);
  const icon = getSVGIcon(componentKey);

  let detailsHTML = '';

  switch (componentKey) {
    case 'brakes':
      detailsHTML = `
        <div class="component-details">
          <div class="detail-item">
            <span class="detail-label">${t('pad_thickness')}</span>
            <span class="detail-value">${component.state || t('not_available')}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${t('disc_condition')}</span>
            <span class="detail-value">${t(component.corrosion_risk ? 'status_attention' : 'status_excellent')}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${t('fluid_moisture')}</span>
            <span class="detail-value">${component.waterContent ? `${(component.waterContent * 100).toFixed(1)}%` : t('not_available')}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${t('corrosion_risk')}</span>
            <span class="detail-value" style="color: ${component.corrosion_risk ? 'var(--warning)' : 'var(--success)'}">
              ${t(component.corrosion_risk ? 'status_attention' : 'status_excellent')}
            </span>
          </div>
        </div>
      `;
      break;

    case 'tires':
      detailsHTML = `
        <div class="component-details">
          <div class="detail-item">
            <span class="detail-label">${t('tread_depth')}</span>
            <span class="detail-value">${component.treadDepth || t('not_available')}</span>
            <span class="detail-unit">mm</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${t('pressure_front')}</span>
            <span class="detail-value">${component.pressureFront || t('not_available')}</span>
            <span class="detail-unit">PSI</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${t('pressure_rear')}</span>
            <span class="detail-value">${component.pressureRear || t('not_available')}</span>
            <span class="detail-unit">PSI</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">${t('season_current')}</span>
            <span class="detail-value">${t(component.current_set === 'winter' ? 'winter' : 'summer')}</span>
          </div>
        </div>
      `;
      break;

    case 'battery':
      if (vehicleType === 'electrico' || vehicleType === 'hibrido') {
        detailsHTML = `
          <div class="component-details">
            <div class="detail-item">
              <span class="detail-label">${t('battery_health')}</span>
              <span class="detail-value">${component.health}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t('charge_cycles')}</span>
              <span class="detail-value">${component.cycles}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t('estimated_range')}</span>
              <span class="detail-value">${component.range}</span>
              <span class="detail-unit">km</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t('cold_efficiency')}</span>
              <span class="detail-value">${(component.coldEfficiency * 100).toFixed(0)}%</span>
            </div>
          </div>
        `;
      }
      break;

    case 'oil_level':
    case 'oil':
      if (vehicleType === 'combustion' || vehicleType === 'hibrido') {
        detailsHTML = `
          <div class="component-details">
            <div class="detail-item">
              <span class="detail-label">${t('oil_level')}</span>
              <span class="detail-value">${component.state || t('not_available')}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t('last_oil_change')}</span>
              <span class="detail-value">${t('recent')}</span>
            </div>
          </div>
        `;
      }
      break;

    default:
      detailsHTML = `
        <div class="component-details">
          <div class="detail-item">
            <span class="detail-label">${t('component_status')}</span>
            <span class="detail-value">${t('monitoring')}</span>
          </div>
        </div>
      `;
  }

  return `
    <div class="component-card">
      <div class="component-header">
        <div class="component-icon">${icon}</div>
        <div class="component-title-area">
          <div class="component-title" data-i18n="comp_${componentKey}">${componentKey}</div>
          <div class="component-desc" data-i18n="comp_${componentKey}_detail">Details...</div>
        </div>
      </div>
      
      <div class="health-indicator">
        <div class="health-bar">
          <div class="health-fill" style="width: ${component.life}%"></div>
        </div>
        <div class="health-percentage">${component.life}%</div>
      </div>
      
      <div class="status-badge status-badge--${status.color}">
        <span class="status-dot status-dot--${status.color}"></span>
        <span data-i18n="${status.label}">${t(status.label)}</span>
      </div>
      
      ${detailsHTML}
    </div>
  `;
}

function renderAlertsSection(vehicle) {
  const alerts = [];

  // Seasonal tire alert
  if (vehicle.components.tires.current_set === 'summer' && new Date().getMonth() >= 10) {
    alerts.push({
      type: 'info',
      title: t('alert_seasonal'),
      message: t('alert_seasonal_winter'),
      icon: 'info'
    });
  }

  // Service due alert
  if (vehicle.nextService) {
    const serviceDate = new Date(vehicle.nextService);
    const daysUntilService = Math.floor((serviceDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilService < 30 && daysUntilService > 0) {
      alerts.push({
        type: 'warning',
        title: t('alert_maintenance'),
        message: `${t('alert_service_due')} in ${daysUntilService} days`,
        icon: 'warning'
      });
    }
  }

  // Corrosion risk (post-winter in Canada)
  if (vehicle.components.brakes.corrosion_risk || vehicle.components.suspension.corrosion_risk) {
    alerts.push({
      type: 'warning',
      title: t('alert_corrosion'),
      message: t('alert_corrosion_msg'),
      icon: 'warning'
    });
  }

  // Cold weather efficiency for EVs
  if (vehicle.tipo_vehiculo === 'electrico' || vehicle.tipo_vehiculo === 'hibrido') {
    if (vehicle.battery.coldEfficiency < 0.90) {
      alerts.push({
        type: 'info',
        title: 'Cold Weather Impact',
        message: `Battery efficiency at ${(vehicle.battery.coldEfficiency * 100).toFixed(0)}% due to cold temperatures`,
        icon: 'info'
      });
    }
  }

  if (alerts.length === 0) {
    return `<div style="text-align: center; padding: 24px; color: var(--text-400);">
      <p style="font-size: 0.9rem;">[✓] No active alerts</p>
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
}

function renderMilestones(mileage, forceEnglish = false) {
  const milestones = [250000, 500000, 1000000];
  const nextMilestone = milestones.find(m => m > mileage);

  const getT = (key) => {
    if (forceEnglish) {
      return i18n.en[key] || key;
    }
    return t(key);
  };

  if (!nextMilestone) {
    return `<p style="color: var(--text-400); font-size: 0.85rem; padding: 16px; text-align: center;">
      [★] ${getT('no_milestones')}
    </p>`;
  }

  const kmToNext = nextMilestone - mileage;
  const progressPercent = ((mileage % 250000) / 250000) * 100;

  const remainingLabel = forceEnglish ? "km remaining" : (currentLanguage === 'es' ? "km restantes" : currentLanguage === 'fr' ? "km restants" : "km remaining");

  return `
    <div class="milestone-badge">
      <div class="milestone-icon">✦</div>
      <div class="milestone-info">
        <div class="milestone-title">${getT('unlock_next')}</div>
        <div class="milestone-desc">${(nextMilestone / 1000).toFixed(0)}K km</div>
        <div class="milestone-progress">${kmToNext.toLocaleString()} ${remainingLabel}</div>
      </div>
    </div>
  `;
}

function renderPreheatWidget(vehicle) {
  if (vehicle.tipo_vehiculo === 'combustion') {
    return '';
  }

  const cabinActive = vehicle.preheating?.cabin === true;
  const batteryActive = vehicle.preheating?.battery === true;
  const remaining = vehicle.preheating?.remaining || vehicle.preheating?.timeNeeded || 8;

  return `
    <div class="preheating-widget">
      <button class="preheat-button ${cabinActive ? 'preheat-button--active' : ''}" onclick="startPreheating('cabin', event)">
        <div class="preheat-icon">CAB</div>
        <div class="preheat-label" data-i18n="preheating_cabin"></div>
        <div class="preheat-status">${cabinActive ? `${t('preheating_active')} · ${remaining}s` : t('preheating_inactive')}</div>
      </button>
      <button class="preheat-button ${batteryActive ? 'preheat-button--active' : ''}" onclick="startPreheating('battery', event)">
        <div class="preheat-icon">BAT</div>
        <div class="preheat-label" data-i18n="preheating_battery"></div>
        <div class="preheat-status">${batteryActive ? `${t('preheating_active')} · ${remaining}s` : t('preheating_inactive')}</div>
      </button>
    </div>
  `;
}
function renderMaintenanceDashboard(clientId) {
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) return '';

  const vehicle = client.vehicle;
  const vehicleType = vehicle.tipo_vehiculo;

  // Filter components based on vehicle type
  let componentsToShow = ['brakes', 'tires', 'suspension', 'hvac'];

  if (vehicleType === 'electrico' || vehicleType === 'hibrido') {
    componentsToShow.push('battery', 'charging', 'cabin_filter');
    if (vehicleType === 'hibrido') {
      componentsToShow.push('electric_motor', 'oil', 'engine');
    }
  } else {
    componentsToShow.push('oil', 'engine', 'cabin_filter');
  }

  const componentsHTML = componentsToShow
    .map(key => {
      if (vehicle.components[key]) {
        return renderComponentCard(key, vehicle.components[key], vehicleType);
      }
      return '';
    })
    .filter(html => html !== '')
    .join('');

  const html = `
    <div class="panel panel--padded" id="panel-dashboard">
      <div class="panel-header">
        <h1 class="panel-title" data-i18n="page_dashboard_title"></h1>
        <p class="panel-subtitle" data-i18n="page_dashboard_sub"></p>
      </div>
      
      <!-- Preheating Widget (EV/Hybrid only) -->
      ${renderPreheatWidget(vehicle)}
      
      <!-- Alerts Section -->
      <div class="section-header" style="margin-top: 20px; margin-bottom: 16px;">
        <h2 style="font-size: 0.95rem; font-weight: 600; color: var(--text-100);" data-i18n="alerts_title"></h2>
      </div>
      <div class="alerts-container">
        ${renderAlertsSection(vehicle)}
      </div>
      
      ${renderDiagnosticQuickAccess(vehicle)}
      
      <!-- Components Grid -->
      <div class="section-header" style="margin-top: 20px; margin-bottom: 16px;">
        <h2 style="font-size: 0.95rem; font-weight: 600; color: var(--text-100);" data-i18n="system_health"></h2>
      </div>
      <div class="components-grid">
        ${componentsHTML}
      </div>
      
      <!-- Milestones -->
      <div class="section-header" style="margin-top: 20px; margin-bottom: 12px;">
        <h2 style="font-size: 0.95rem; font-weight: 600; color: var(--text-100);" data-i18n="milestones_title"></h2>
      </div>
      <div class="milestones-container">
        ${renderMilestones(vehicle.mileage)}
      </div>
      
      <!-- Usage Report -->
      <div class="section-header" style="margin-top: 20px; margin-bottom: 12px;">
        <h2 style="font-size: 0.95rem; font-weight: 600; color: var(--text-100);" data-i18n="usage_title"></h2>
      </div>
      <div class="usage-report">
        <div class="usage-stat">
          <div class="usage-value">${vehicle.mileage.toLocaleString()}</div>
          <div class="usage-label" data-i18n="total_mileage"></div>
        </div>
        <div class="usage-stat">
          <div class="usage-value">${vehicle.usage.monthly.toLocaleString()}</div>
          <div class="usage-label" data-i18n="monthly_average"></div>
        </div>
      </div>
    </div>
  `;

  return html;
}

function renderMyVehiclePanel(clientId) {
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) return '';

  const vehicle = client.vehicle;

  const html = `
    <div class="panel panel--padded" id="panel-myvehicle">
      <div class="panel-header">
        <h1 class="panel-title" data-i18n="page_myvehicle_title"></h1>
        <p class="panel-subtitle" data-i18n="page_myvehicle_sub"></p>
      </div>
      <div class="panel-image" style="margin:18px 0;text-align:center;">
        <div class="vehicle-silhouette">
          <img src="eqs.png" class="vehicle-image" alt="EQS" />
        </div>
      </div>
      
      <!-- General Information -->
      <div class="info-group">
        <div class="info-group-title" data-i18n="general_info"></div>
        <div class="info-row">
          <div class="info-key" data-i18n="year_model"></div>
          <div class="info-val">${vehicle.year}</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="model"></div>
          <div class="info-val">${vehicle.model}</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="color_exterior"></div>
          <div class="info-val">${vehicle.color}</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="color_interior"></div>
          <div class="info-val">${vehicle.interiorColor}</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="vin"></div>
          <div class="info-val" style="font-family: monospace; font-size: 0.78rem;">${vehicle.vin}</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="license_plate"></div>
          <div class="info-val">${vehicle.licensePlate}</div>
        </div>
      </div>
      
      <!-- Engine/Motor Specifications -->
      <div class="info-group" style="margin-top: 16px;">
        <div class="info-group-title" data-i18n="engine_specs"></div>
        ${vehicle.tipo_vehiculo === 'electrico' ? `
          <div class="info-row">
            <div class="info-key" data-i18n="battery_label"></div>
            <div class="info-val">${vehicle.specs.batteryCapacity}</div>
          </div>
          <div class="info-row">
            <div class="info-key" data-i18n="electric_power"></div>
            <div class="info-val">${vehicle.specs.electricPower}</div>
          </div>
          <div class="info-row">
            <div class="info-key" data-i18n="official_range"></div>
            <div class="info-val">${vehicle.specs.officialRange}</div>
          </div>
        ` : `
          <div class="info-row">
            <div class="info-key" data-i18n="displacement"></div>
            <div class="info-val">${vehicle.specs.displacement || 'N/A'}</div>
          </div>
          <div class="info-row">
            <div class="info-key" data-i18n="horsepower"></div>
            <div class="info-val">${vehicle.specs.horsepower}</div>
          </div>
          <div class="info-row">
            <div class="info-key" data-i18n="torque"></div>
            <div class="info-val">${vehicle.specs.torque}</div>
          </div>
          <div class="info-row">
            <div class="info-key" data-i18n="fuel_type"></div>
            <div class="info-val">${vehicle.specs.fuelType}</div>
          </div>
          <div class="info-row">
            <div class="info-key" data-i18n="fuel_capacity"></div>
            <div class="info-val">${vehicle.specs.fuelCapacity || 'N/A'}</div>
          </div>
        `}
        <div class="info-row">
          <div class="info-key" data-i18n="transmission"></div>
          <div class="info-val">${vehicle.specs.transmission}</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="traction"></div>
          <div class="info-val">${vehicle.specs.traction}</div>
        </div>
      </div>
      
      <!-- Current Status -->
      <div class="info-group" style="margin-top: 16px;">
        <div class="info-group-title" data-i18n="current_status"></div>
        <div class="info-row">
          <div class="info-key" data-i18n="current_mileage"></div>
          <div class="info-val">${vehicle.mileage.toLocaleString()} km</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="health_score"></div>
          <div class="info-val">${vehicle.health}%</div>
        </div>
        <div class="info-row">
          <div class="info-key" data-i18n="last_service"></div>
          <div class="info-val">${new Date(vehicle.lastService).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  `;

  return html;
}
