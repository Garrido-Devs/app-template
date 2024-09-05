import React, { useEffect } from "react";
import { Button, View, Text } from "react-native";
import {
  readAllHealthData,
  requestHealthPermissions,
  initializeHealthConnectClient,
} from "./src/HealthConnectService";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "background-fetch-task";

// Função para enviar os dados para o backend
const sendDataToBackend = async (data: any) => {
  try {
    const response = await fetch(
      "https://clickcannabis.app.n8n.cloud/webhook/107d5219-2d30-4232-b9b9-c8e347d49b5e",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ healthData: data }),
      }
    );

    if (!response.ok) {
      console.log("Erro ao enviar os dados:", response.statusText);
    } else {
      console.log("Dados enviados com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao enviar dados ao backend:", error);
  }
};

// Função que será executada a cada 1 minuto para testar
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log("Rodando a tarefa em background...");

    // Inicializa o Health Connect no background
    const isInitialized = await initializeHealthConnectClient();
    if (!isInitialized) {
      console.log("Erro: Health Connect client não pôde ser inicializado.");
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    console.log("Coletando dados de saúde...");
    const healthData = await readAllHealthData(); // Coletar todos os dados de saúde
    if (healthData) {
      await sendDataToBackend(healthData); // Enviar os dados ao backend
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log("Erro durante o background fetch:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Função para inicializar o BackgroundFetch
const initBackgroundFetch = async () => {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    console.log("Status do BackgroundFetch:", status);

    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      console.log("Background fetch não está disponível.");
      return;
    }

    const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_FETCH_TASK);
    if (!isTaskDefined) {
      console.log("Tarefa de background fetch não está definida.");
      return;
    }

    // Registra o Background Fetch para ser executado a cada 1 minuto (para teste)
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 1 * 60, // 1 minuto para teste
      stopOnTerminate: false, // Continuar após o app ser fechado
      startOnBoot: true, // Reiniciar após o dispositivo reiniciar
    });

    console.log("Background fetch registrado com sucesso.");
  } catch (error) {
    console.log("Erro ao inicializar o background fetch:", error);
  }
};

// Integração com o Health Connect para permissões de múltiplos dados
export const initHealthConnectPermissions = async () => {
  try {
    // Inicializar o Health Connect antes de solicitar permissões
    const isInitialized = await initializeHealthConnectClient();
    if (!isInitialized) {
      console.log("Health Connect não pôde ser inicializado.");
      return;
    }

    const grantedPermissions = await requestHealthPermissions();
    if (grantedPermissions) {
      console.log("Permissões concedidas, começando a coleta de dados...");
    } else {
      console.log("Permissões negadas.");
    }
  } catch (error) {
    console.error("Erro ao inicializar permissões do Health Connect:", error);
  }
};

export default function App() {
  useEffect(() => {
    initBackgroundFetch(); // Inicializar o Background Fetch
    initHealthConnectPermissions(); // Solicitar permissões do Health Connect
  }, []);

  const handleGetData = async () => {
    try {
      const healthData = await readAllHealthData();
      if (healthData) {
        await sendDataToBackend(healthData); // Enviar dados ao backend manualmente
      }
    } catch (error) {
      console.log("Erro ao obter ou enviar dados de saúde:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Google Health Connect Integration</Text>
      <Button title="Get Health Data" onPress={handleGetData} />
    </View>
  );
}
