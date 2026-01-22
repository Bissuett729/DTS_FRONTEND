// ==================== OBTENER IP ====================
const ip = ((window.location.href).split(`/`)[2]).split(`:`)[0];

// ==================== MAPEO DE UNIDADES DE NEGOCIO ====================
const BUSINESS_UNIT_MAP: Record<string, string> = {
    '10.19.16.84': 'LVO',
    '172.18.1.250': 'LVO',
    '10.19.16.15': 'Microsoft',
    '10.19.16.37': 'Microsoft',
    '10.9.0.205': 'Microsoft',
    '10.9.0.208': 'Microsoft',
};

// ==================== UNIDAD DE NEGOCIO ====================
const businessUnit = BUSINESS_UNIT_MAP[ip] || 'Unknown';

// ==================== SERVIDORES ====================
const servMsftProd = ip.includes('10.9.0') ? '10.9.0.205' : '10.19.16.15';
const servMsftDev = ip.includes('10.9.0') ? '10.9.0.208' : '10.19.16.37';
const servlVOProd = ip.includes('172.18.1') ? '172.18.1.250' : '10.19.16.84';

// ==================== MODE ====================
const isUAT = servMsftDev === ip;

// ==================== HELPERS ====================
const resolveServer = (port: number, fallback: string): string => {
    return `http://${ip.includes('172.18.1') ? '172.18.1.250' : fallback}:${port}`;
};

// ==================== ENVIRONMENT ====================
export const environment = {
    // ========= System environments ==================
    IP: ip,
    ENCRYPTION_KEY: `yHojgZdVh9Q+al5UwAQxHTv0IFakDBQIVlIGvHPRrCc=`,
    production: true,
    mode: isUAT ? 'UAT' : 'PROD',
    BUSINESS_UNIT: businessUnit,

    // ========= User environment ==================
    userURL: resolveServer(20024, servMsftDev),
};