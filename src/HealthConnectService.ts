import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

export const initializeHealthConnectClient = async () => {
  try {
    const isInitialized = await initialize();
    if (!isInitialized) {
      console.error('Health Connect não pôde ser inicializado.');
      return false;
    }
    console.log('Health Connect inicializado com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o Health Connect:', error);
    return false;
  }
};

// Função para solicitar permissões para múltiplos tipos de registros
export const requestHealthPermissions = async () => {
  try {
    const grantedPermissions = await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'SleepSession' },
      { accessType: 'read', recordType: 'BodyFat' },
      { accessType: 'read', recordType: 'BodyTemperature' },
      { accessType: 'read', recordType: 'BloodPressure' },
      { accessType: 'read', recordType: 'Nutrition' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'Weight' }
    ]);

    if (grantedPermissions.length === 0) {
      console.log('Permissões negadas.');
      return null;
    }

    console.log('Permissões concedidas:', grantedPermissions);
    return grantedPermissions;
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    return null;
  }
};


// Funções para coletar dados de diferentes tipos
export const readAllHealthData = async () => {
  try {
    console.log('Coletando dados de saúde...');

    const steps = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Dados de passos:', steps);

    const sleepSessions = await readRecords('SleepSession', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Sessões de sono:', sleepSessions);

    const bodyFat = await readRecords('BodyFat', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Gordura corporal:', bodyFat);

    const bodyTemperature = await readRecords('BodyTemperature', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Temperatura corporal:', bodyTemperature);

    const bloodPressure = await readRecords('BloodPressure', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Pressão sanguínea:', bloodPressure);

    const nutrition = await readRecords('Nutrition', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Nutrição:', nutrition);

    const heartRate = await readRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Frequência cardíaca:', heartRate);

    const weight = await readRecords('Weight', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-09-01T00:00:00Z',
        endTime: new Date().toISOString(),
      },
    });
    console.log('Peso:', weight);

    // Retornar todos os dados coletados
    return {
      steps: steps.records,
      sleepSessions: sleepSessions.records,
      bodyFat: bodyFat.records,
      bodyTemperature: bodyTemperature.records,
      bloodPressure: bloodPressure.records,
      nutrition: nutrition.records,
      heartRate: heartRate.records,
      weight: weight.records,
    };
  } catch (error) {
    console.error('Erro ao ler dados de saúde:', error);
    return null;
  }
};

