import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { testBackendAuth } from "../hooks/useTestAuth";

export default function TestAuthButton() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setError(null);
    setResult(null);
    try {
      const data = await testBackendAuth();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View>
      <Button title="Test Backend Auth" onPress={handleTest} />
      {result && <Text selectable>{JSON.stringify(result, null, 2)}</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}