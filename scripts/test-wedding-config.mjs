import assert from 'node:assert/strict';
import { wedding, eventDate, calendarUrl } from '../app/wedding-config.ts';

assert.equal(eventDate().toISOString(), '2026-11-14T02:00:00.000Z');
assert.equal(calendarUrl(), null);
wedding.venueName = 'Tempat Uji';
wedding.venueAddress = 'Alamat Uji';
assert.equal(eventDate().toISOString(), '2026-11-14T02:00:00.000Z');
const url = new URL(calendarUrl());
assert.equal(url.hostname, 'calendar.google.com');
assert.equal(url.searchParams.get('dates'), '20261114T020000Z/20261114T040000Z');
assert.equal(url.searchParams.get('location'), 'Tempat Uji, Alamat Uji');
console.log('Wedding date and Calendar URL: PASS');
