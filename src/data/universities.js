// Mock university directory.
// Email domains are only used for lightweight demo validation and can be
// changed freely — this whole file will later be replaced by a Supabase
// `universities` table query.

export const universities = [
  {
    id: 'cust',
    name: 'Capital University of Science & Technology',
    shortName: 'CUST',
    city: 'Islamabad',
    country: 'Pakistan',
    emailDomain: 'cust.edu.pk',
  },
  {
    id: 'comsats-isb',
    name: 'COMSATS University Islamabad',
    shortName: 'COMSATS',
    city: 'Islamabad',
    country: 'Pakistan',
    emailDomain: 'comsats.edu.pk',
  },
  {
    id: 'fast',
    name: 'FAST-NUCES',
    shortName: 'FAST',
    city: 'Islamabad',
    country: 'Pakistan',
    emailDomain: 'nu.edu.pk',
  },
  {
    id: 'nust',
    name: 'National University of Sciences and Technology',
    shortName: 'NUST',
    city: 'Islamabad',
    country: 'Pakistan',
    emailDomain: 'nust.edu.pk',
  },
  {
    id: 'bahria',
    name: 'Bahria University',
    shortName: 'Bahria',
    city: 'Islamabad',
    country: 'Pakistan',
    emailDomain: 'bahria.edu.pk',
  },
];

export const getUniversityById = (id) => universities.find((u) => u.id === id);

export const DEFAULT_UNIVERSITY_ID = 'cust';
