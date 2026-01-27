"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import type { NeuralNetworkValidation } from "../types"

interface NeuralNetworkValidatorProps {
  reportId?: string
  onValidationComplete?: (validation: NeuralNetworkValidation) => void
}

export const NeuralNetworkValidator: React.FC<NeuralNetworkValidatorProps> = ({ reportId, onValidationComplete }) => {
  const [validations, setValidations] = useState<NeuralNetworkValidation[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>("")

  // Mock neural network validation process
  const runValidation = async (algorithm: NeuralNetworkValidation["algorithm"]) => {
    setIsProcessing(true)
    setCurrentAlgorithm(algorithm)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

    const validation: NeuralNetworkValidation = {
      id: `val_${Date.now()}`,
      reportId: reportId || "unknown",
      algorithm,
      confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
      result: {
        isValid: Math.random() > 0.2, // 80% chance of being valid
        riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
        factors: getValidationFactors(algorithm),
      },
      timestamp: new Date().toISOString(),
      modelVersion: "v2.1.0",
    }

    setValidations((prev) => [validation, ...prev])
    setIsProcessing(false)
    setCurrentAlgorithm("")
    onValidationComplete?.(validation)

    return validation
  }

  const getValidationFactors = (algorithm: NeuralNetworkValidation["algorithm"]): string[] => {
    const factorMap = {
      fake_news_detection: [
        "Source credibility analysis",
        "Content similarity check",
        "Temporal pattern analysis",
        "Cross-platform verification",
      ],
      sentiment_analysis: [
        "Emotional tone detection",
        "Keyword sentiment mapping",
        "Context-aware analysis",
        "Multi-language processing",
      ],
      credibility_scoring: [
        "Author reputation score",
        "Historical accuracy rate",
        "Verification badge status",
        "Network trust metrics",
      ],
      geo_validation: [
        "Location consistency check",
        "Proximity to known hazards",
        "Geographic plausibility",
        "Satellite data correlation",
      ],
    }

    return factorMap[algorithm] || []
  }

  const getAlgorithmIcon = (algorithm: NeuralNetworkValidation["algorithm"]) => {
    switch (algorithm) {
      case "fake_news_detection":
        return <Shield className="w-4 h-4" />
      case "sentiment_analysis":
        return <Brain className="w-4 h-4" />
      case "credibility_scoring":
        return <CheckCircle className="w-4 h-4" />
      case "geo_validation":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Brain className="w-5 h-5 mr-2" />
            Neural Network Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              onClick={() => runValidation("fake_news_detection")}
              disabled={isProcessing}
              size="sm"
              variant="outline"
            >
              <Shield className="w-3 h-3 mr-1" />
              Fake News Detection
            </Button>
            <Button
              onClick={() => runValidation("sentiment_analysis")}
              disabled={isProcessing}
              size="sm"
              variant="outline"
            >
              <Brain className="w-3 h-3 mr-1" />
              Sentiment Analysis
            </Button>
            <Button
              onClick={() => runValidation("credibility_scoring")}
              disabled={isProcessing}
              size="sm"
              variant="outline"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Credibility Scoring
            </Button>
            <Button onClick={() => runValidation("geo_validation")} disabled={isProcessing} size="sm" variant="outline">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Geo Validation
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing {currentAlgorithm.replace("_", " ")}...</span>
              </div>
              <Progress value={Math.random() * 100} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {validations.map((validation) => (
          <Card key={validation.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getAlgorithmIcon(validation.algorithm)}
                  <span className="font-medium text-sm capitalize">{validation.algorithm.replace("_", " ")}</span>
                  <Badge variant="outline">{Math.round(validation.confidence * 100)}% confidence</Badge>
                </div>

                <div className="flex items-center space-x-2">
                  {validation.result.isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <Badge className={getRiskColor(validation.result.riskLevel)}>
                    {validation.result.riskLevel} risk
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  Model: {validation.modelVersion} • {new Date(validation.timestamp).toLocaleString()}
                </div>

                <div>
                  <p className="text-xs font-medium mb-1">Analysis Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {validation.result.factors.map((factor, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {validations.length === 0 && !isProcessing && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No validations run yet. Click a button above to start AI analysis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
