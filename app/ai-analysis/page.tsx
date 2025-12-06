"use client"
import React, { useState } from 'react';

const AIAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const storedData = localStorage.getItem('csvData');
    if (!storedData) {
      alert('No data available. Please upload a CSV file first.');
      return;
    }

    const parsedData = JSON.parse(storedData);

    setLoading(true);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/your-model', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: parsedData }),
      });

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Analysis</h1>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Data'}
      </button>
      {analysisResult && (
        <div>
          <h2>Analysis Result</h2>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;