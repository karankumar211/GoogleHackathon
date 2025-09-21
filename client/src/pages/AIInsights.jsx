import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Button from "../components/Button";
import { getFinancialInsights } from "../utils/api";
const AIInsights = () => {
  const [selectedInsightType, setSelectedInsightType] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const insightTypes = [
    { id: "all", name: "All Insights", color: "bg-gray-100 text-gray-800" },
    {
      id: "spending",
      name: "Spending Tips",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "savings",
      name: "Savings Advice",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "investment",
      name: "Investment",
      color: "bg-purple-100 text-purple-800",
    },
    { id: "debt", name: "Debt Management", color: "bg-red-100 text-red-800" },
  ];
  const [aiInsight, setAiInsight] = useState([]);

  useEffect(() => {
    // Fetch AI insights from the backend API
    const fetchInsights = async () => {
      try {
        const response = await getFinancialInsights();
        setAiInsight(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
      }
    };
    fetchInsights();
  }, []);
  console.log(aiInsight);

  // Map selectedInsightType to category name for filtering
  const typeToCategory = {
    spending: "Food",
    savings: "Savings",
    investment: "Investment",
    debt: "Debt Management",
  };

  const filteredInsights =
    selectedInsightType === "all"
      ? aiInsight
      : aiInsight.filter(
          (insight) =>
            insight.category &&
            insight.category
              .toLowerCase()
              .includes(
                typeToCategory[selectedInsightType]?.toLowerCase() || ""
              )
        );

  const totalPotentialSavings = filteredInsights.reduce(
    (sum, insight) =>
      sum + (insight.estimatedSavings || insight.estimatedAnnualSavings || 0),
    0
  );

  const spendingAnalysis = [
    { label: "Food & Dining", value: 1200, recommended: 960, status: "over" },
    {
      label: "Transportation",
      value: 800,
      recommended: 800,
      status: "optimal",
    },
    { label: "Entertainment", value: 400, recommended: 300, status: "over" },
    { label: "Shopping", value: 600, recommended: 500, status: "over" },
    { label: "Utilities", value: 300, recommended: 300, status: "optimal" },
  ];

  const generateNewInsight = () => {
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would typically call your AI service
      console.log("Generating new AI insight...");
    }, 2000);
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "over":
        return "text-red-600";
      case "optimal":
        return "text-green-600";
      case "under":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">
            Personalized financial recommendations powered by artificial
            intelligence.
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button onClick={generateNewInsight} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Generate New Insight
              </>
            )}
          </Button>
          <Link to="/chat">
            <Button variant="outline">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chat with AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900">
              {filteredInsights.length}
            </div>
            <div className="text-sm text-blue-700">Active Insights</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              ₹{totalPotentialSavings.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">
              Potential Annual Savings
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900">92%</div>
            <div className="text-sm text-purple-700">Average Confidence</div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {insightTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedInsightType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedInsightType === type.id
                  ? "bg-blue-600 text-white"
                  : type.color + " hover:bg-gray-200"
              }`}>
              {type.name}
            </button>
          ))}
        </div>
      </Card>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(
                      insight.impact
                    )}`}>
                    {insight.impact} Impact
                  </span>
                  <span className="text-sm text-gray-500">
                    • {insight.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {insight.title}
                </h3>
                 <p className="text-gray-600 text-sm mb-3">
                  {insight.summary}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  {insight.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {insight.confidence}%
                </div>
                <div className="text-xs text-gray-500">Confidence</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Estimated Annual Savings:</span>
                <span className="font-semibold text-green-600">
                  ₹{insight.estimatedAnnualSavings}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Action Items:
              </h4>
              <ul className="space-y-1">
                {insight.actionItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                Apply Actions
              </Button>
              
            </div>
          </Card>
        ))}
      </div>

      {/* Spending Analysis */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Spending vs. Recommendations
        </h3>
        <div className="space-y-4">
          {spendingAnalysis.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium text-gray-900">
                {item.label}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Current: ₹{item.value}</span>
                  <span className="text-gray-600">
                    Recommended: ₹{item.recommended}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.status === "over"
                        ? "bg-red-500"
                        : item.status === "optimal"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (item.value / item.recommended) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div
                className={`w-16 text-sm font-medium ${getStatusColor(
                  item.status
                )}`}>
                {item.status === "over"
                  ? "Over"
                  : item.status === "optimal"
                  ? "Optimal"
                  : "Under"}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Explanation */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How AI Generates These Insights
            </h3>
            <p className="text-gray-600 mb-3">
              Our AI analyzes your spending patterns, compares them to financial
              best practices, and identifies opportunities for improvement. It
              considers factors like income level, location, and financial goals
              to provide personalized recommendations.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Data is analyzed securely and anonymously</p>
              <p>• Recommendations update based on your financial changes</p>
              <p>• Confidence scores reflect the strength of each insight</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIInsights;
