#!/usr/bin/env node

/**
 * Test simple des filtres - Logique JavaScript pure
 * Pas de dépendances Jest, exécutable directement avec Node
 */

// Données de test
const testData = [
  {
    id: '1',
    name: 'Pierre Wurtig – Admin',
    role: 'Audioprothésiste',
    specialty: 'Audioprothésiste',
    zipCode: '75001',
    city: 'Paris',
  },
  {
    id: '2',
    name: 'Marie Dupont',
    role: 'ORL',
    specialty: 'ORL',
    zipCode: '75002',
    city: 'Paris',
  },
  {
    id: '3',
    name: 'Jean Martin',
    role: 'Cardiologue',
    specialty: 'Cardiologie',
    zipCode: '69000',
    city: 'Lyon',
  },
];

// Fonction de filtrage (identique à ProfessionalsPage.tsx)
function applyFilters(professionals, filters) {
  return professionals
    .filter(p => {
      // Filtre par recherche
      const matchesSearch =
        p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Filtre par spécialité
      const matchesSpecialty = !filters.specialty || p.specialty === filters.specialty;

      // Filtre par code postal
      const matchesZipCode = !filters.zipCode || p.zipCode.includes(filters.zipCode);

      // Filtre par ville
      const matchesCity =
        !filters.city || p.city.toLowerCase().includes(filters.city.toLowerCase());

      return matchesSearch && matchesSpecialty && matchesZipCode && matchesCity;
    })
    .slice(0, filters.itemsPerPage);
}

// Tests
let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ Test ${totalTests}: ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - Expected ${expected}, got ${actual}`);
  }
}

function assertArrayLength(arr, length, message) {
  if (arr.length !== length) {
    throw new Error(`${message} - Expected length ${length}, got ${arr.length}`);
  }
}

// ============================================================================
// TESTS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('TESTING FILTER LOGIC');
console.log('='.repeat(80) + '\n');

// Test 1: Aucun filtre
test('No filters applied - should return all', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 3, 'No filters');
});

// Test 2: Filtre par spécialité
test('Filter by specialty - Audioprothésiste', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: 'Audioprothésiste',
    zipCode: '',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Specialty filter');
  assertEqual(result[0].name, 'Pierre Wurtig – Admin', 'Correct person');
});

// Test 3: Filtre par code postal
test('Filter by zip code - 75', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '75',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 2, 'Zip code filter');
});

// Test 4: Filtre par ville
test('Filter by city - Paris', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '',
    city: 'Paris',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 2, 'City filter');
});

// Test 5: Filtre par nombre d'items
test('Filter by items per page - 2', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 2,
    specialty: '',
    zipCode: '',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 2, 'Items limit');
});

// Test 6: Combinaison (Specialty + City)
test('Combination filter - Specialty (Audioprothésiste) + City (Paris)', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: 'Audioprothésiste',
    zipCode: '',
    city: 'Paris',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Combination');
  assertEqual(result[0].name, 'Pierre Wurtig – Admin', 'Correct result');
});

// Test 7: Recherche textuelle
test('Search by name - "Martin"', () => {
  const filters = {
    searchQuery: 'Martin',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Search filter');
  assertEqual(result[0].name, 'Jean Martin', 'Found correct person');
});

// Test 8: Recherche case-insensitive
test('Case-insensitive search - "LYON"', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '',
    city: 'LYON',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Case-insensitive');
  assertEqual(result[0].city, 'Lyon', 'Found Lyon');
});

// Test 9: Combinaison complexe
test('Complex combination - ORL + Paris + 4 items', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 4,
    specialty: 'ORL',
    zipCode: '',
    city: 'Paris',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Complex combo');
  assertEqual(result[0].name, 'Marie Dupont', 'Correct person');
});

// Test 10: Aucun résultat
test('No results - Cardiologie + Code postal 75', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 8,
    specialty: 'Cardiologie',
    zipCode: '75',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 0, 'No results');
});

// Test 11: Recherche par rôle
test('Search by role - "ORL"', () => {
  const filters = {
    searchQuery: 'ORL',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Role search');
  assertEqual(result[0].name, 'Marie Dupont', 'Found correct person');
});

// Test 12: Multiple items per page limits
test('Items per page = 1', () => {
  const filters = {
    searchQuery: '',
    itemsPerPage: 1,
    specialty: '',
    zipCode: '',
    city: '',
  };
  const result = applyFilters(testData, filters);
  assertArrayLength(result, 1, 'Items limit to 1');
});

// ============================================================================
// RÉSULTATS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log(`RÉSULTATS: ${passedTests}/${totalTests} tests PASSED`);
console.log('='.repeat(80) + '\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL TESTS PASSED! 🎉');
  console.log('\n✅ Filtres fonctionnent correctement:');
  console.log('   ✓ Filtre par nombre d\'items');
  console.log('   ✓ Filtre par spécialité');
  console.log('   ✓ Filtre par code postal');
  console.log('   ✓ Filtre par ville');
  console.log('   ✓ Combinaisons de filtres');
  console.log('   ✓ Recherche textuelle');
  console.log('   ✓ Case-insensitive search');
  console.log('\n🚀 Prêt pour la production!\n');
  process.exit(0);
} else {
  console.log(`❌ ${totalTests - passedTests} test(s) failed\n`);
  process.exit(1);
}
