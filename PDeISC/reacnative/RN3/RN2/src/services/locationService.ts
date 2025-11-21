// src/services/locationService.ts

interface City {
  id: string;
  name: string;
}

interface Province {
  id: string;
  name: string;
  cities: City[];
}

interface Country {
  id: string;
  name: string;
  code: string;
  provinces: Province[];
}

const LOCATION_DATA: Country[] = [
  {
    id: "AR",
    name: "Argentina",
    code: "AR",
    provinces: [
      {
        id: "BA",
        name: "Buenos Aires",
        cities: [
          { id: "CABA", name: "Ciudad Autónoma de Buenos Aires" },
          { id: "LP", name: "La Plata" },
          { id: "MDP", name: "Mar del Plata" },
          { id: "BAHI", name: "Bahía Blanca" },
          { id: "TAND", name: "Tandil" },
        ],
      },
      {
        id: "CORD",
        name: "Córdoba",
        cities: [
          { id: "CBA", name: "Córdoba" },
          { id: "VCA", name: "Villa Carlos Paz" },
          { id: "RCUA", name: "Río Cuarto" },
        ],
      },
      {
        id: "SF",
        name: "Santa Fe",
        cities: [
          { id: "ROS", name: "Rosario" },
          { id: "SFEC", name: "Santa Fe" },
          { id: "VGOB", name: "Villa Gobernador Gálvez" },
        ],
      },
      {
        id: "MEND",
        name: "Mendoza",
        cities: [
          { id: "MEND", name: "Mendoza" },
          { id: "SRAF", name: "San Rafael" },
          { id: "GODCR", name: "Godoy Cruz" },
        ],
      },
      {
        id: "TUC",
        name: "Tucumán",
        cities: [
          { id: "SMT", name: "San Miguel de Tucumán" },
          { id: "TAFI", name: "Tafí Viejo" },
        ],
      },
      {
        id: "JUJ",
        name: "Jujuy",
        cities: [
          { id: "SSJUJ", name: "San Salvador de Jujuy" },
          { id: "PALP", name: "San Pedro de Jujuy" },
        ],
      },
      {
        id: "RN",
        name: "Río Negro",
        cities: [
          { id: "VIED", name: "Viedma" },
          { id: "BARI", name: "San Carlos de Bariloche" },
          { id: "CIRP", name: "Cipolletti" },
        ],
      },
      {
        id: "SALT",
        name: "Salta",
        cities: [
          { id: "SALT", name: "Salta" },
          { id: "ORAN", name: "San Ramón de la Nueva Orán" },
        ],
      },
      {
        id: "MISI",
        name: "Misiones",
        cities: [
          { id: "POS", name: "Posadas" },
          { id: "OBERA", name: "Oberá" },
        ],
      },
      {
        id: "CHACO",
        name: "Chaco",
        cities: [
          { id: "RES", name: "Resistencia" },
          { id: "PRSPE", name: "Presidencia Roque Sáenz Peña" },
        ],
      },
    ],
  },
  {
    id: "US",
    name: "Estados Unidos",
    code: "US",
    provinces: [
      {
        id: "CA",
        name: "California",
        cities: [
          { id: "LA", name: "Los Angeles" },
          { id: "SF", name: "San Francisco" },
          { id: "SD", name: "San Diego" },
          { id: "SJ", name: "San José" },
        ],
      },
      {
        id: "NY",
        name: "Nueva York",
        cities: [
          { id: "NYC", name: "Nueva York" },
          { id: "BUF", name: "Buffalo" },
          { id: "ROCH", name: "Rochester" },
        ],
      },
      {
        id: "TX",
        name: "Texas",
        cities: [
          { id: "HOU", name: "Houston" },
          { id: "DAL", name: "Dallas" },
          { id: "AUS", name: "Austin" },
          { id: "SA", name: "San Antonio" },
        ],
      },
      {
        id: "FL",
        name: "Florida",
        cities: [
          { id: "MIA", name: "Miami" },
          { id: "ORL", name: "Orlando" },
          { id: "TAM", name: "Tampa" },
        ],
      },
    ],
  },
  {
    id: "MX",
    name: "México",
    code: "MX",
    provinces: [
      {
        id: "CDMX",
        name: "Ciudad de México",
        cities: [
          { id: "CDMX", name: "Ciudad de México" },
        ],
      },
      {
        id: "JAL",
        name: "Jalisco",
        cities: [
          { id: "GDL", name: "Guadalajara" },
          { id: "ZAPAT", name: "Zapopan" },
        ],
      },
      {
        id: "NL",
        name: "Nuevo León",
        cities: [
          { id: "MTY", name: "Monterrey" },
          { id: "SNICO", name: "San Nicolás de los Garza" },
        ],
      },
    ],
  },
  {
    id: "ES",
    name: "España",
    code: "ES",
    provinces: [
      {
        id: "MAD",
        name: "Madrid",
        cities: [
          { id: "MAD", name: "Madrid" },
          { id: "ALCA", name: "Alcalá de Henares" },
        ],
      },
      {
        id: "BCN",
        name: "Barcelona",
        cities: [
          { id: "BCN", name: "Barcelona" },
          { id: "HOSP", name: "L'Hospitalet de Llobregat" },
        ],
      },
      {
        id: "VAL",
        name: "Valencia",
        cities: [
          { id: "VAL", name: "Valencia" },
          { id: "TORM", name: "Torrent" },
        ],
      },
    ],
  },
  {
    id: "CO",
    name: "Colombia",
    code: "CO",
    provinces: [
      {
        id: "BOG",
        name: "Bogotá D.C.",
        cities: [
          { id: "BOG", name: "Bogotá" },
        ],
      },
      {
        id: "ANT",
        name: "Antioquia",
        cities: [
          { id: "MED", name: "Medellín" },
          { id: "BELL", name: "Bello" },
        ],
      },
      {
        id: "VAC",
        name: "Valle del Cauca",
        cities: [
          { id: "CALI", name: "Cali" },
          { id: "PALM", name: "Palmira" },
        ],
      },
    ],
  },
  {
    id: "CL",
    name: "Chile",
    code: "CL",
    provinces: [
      {
        id: "RM",
        name: "Región Metropolitana",
        cities: [
          { id: "STGO", name: "Santiago" },
          { id: "PUEN", name: "Puente Alto" },
        ],
      },
      {
        id: "VAL",
        name: "Valparaíso",
        cities: [
          { id: "VALP", name: "Valparaíso" },
          { id: "VINA", name: "Viña del Mar" },
        ],
      },
    ],
  },
];

export const getCountries = (): Country[] => {
  return LOCATION_DATA;
};

export const getProvincesByCountry = (countryId: string): Province[] => {
  const country = LOCATION_DATA.find(c => c.id === countryId);
  return country ? country.provinces : [];
};

export const getCitiesByProvince = (
  countryId: string,
  provinceId: string
): City[] => {
  const country = LOCATION_DATA.find(c => c.id === countryId);
  if (!country) return [];

  const province = country.provinces.find(p => p.id === provinceId);
  return province ? province.cities : [];
};

export const getCountryById = (countryId: string): Country | undefined => {
  return LOCATION_DATA.find(c => c.id === countryId);
};

export const getProvinceById = (
  countryId: string,
  provinceId: string
): Province | undefined => {
  const country = LOCATION_DATA.find(c => c.id === countryId);
  if (!country) return undefined;
  return country.provinces.find(p => p.id === provinceId);
};

export const getCityById = (
  countryId: string,
  provinceId: string,
  cityId: string
): City | undefined => {
  const province = getProvinceById(countryId, provinceId);
  if (!province) return undefined;
  return province.cities.find(c => c.id === cityId);
};