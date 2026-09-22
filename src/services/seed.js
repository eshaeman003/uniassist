import { seedIfEmpty } from './storage';
import {
  seedUsers,
  seedReports,
  seedOtherReports,
  seedLostFound,
  seedAnnouncements,
  seedStudents,
} from '../data/mockData';

let didInit = false;

/** Populates localStorage with demo data the very first time the app runs. */
export function initDemoData() {
  if (didInit) return;
  didInit = true;

  seedIfEmpty('users', seedUsers);
  seedIfEmpty('reports', [...seedReports, ...seedOtherReports]);
  seedIfEmpty('lostFound', seedLostFound);
  seedIfEmpty('announcements', seedAnnouncements);
  seedIfEmpty('students', seedStudents);
  seedIfEmpty('universities_registered', []);
}
