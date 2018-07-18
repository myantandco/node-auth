const ALL_SCOPES = {
    HEART_RATE: {
        name: "Heart Rate",
        description: "Heart rate",
        value: 'metric.heartRate'
    },
    TEMPERATURE: {
        name: "Temperature",
        description: "Temperature",
        value: 'metric.temperature'
    },
    STRESS: {
        name: "Stress",
        description: "Stress",
        value: 'metric.stress'
    },
    STEPS: {
        name: "Step Count",
        description: "Step count",
        value: 'metric.step'
    },
    BREATHING_RATE: {
        name: "Breathing Rate",
        description: "Breathing rate",
        value: 'metric.breathingRate'
    },
    ACTIVITY: {
        name: "Activity",
        description: "Activity",
        value: 'metric.activity'
    },
    CALORIES: {
        name: "Calories",
        description: "Calories burned",
        value: 'metric.calorie'
    },
    POSTURE: {
        name: "Posture",
        description: "Posture",
        value: 'metric.posture'
    },
    DISTANCE: {
        name: "Distance",
        description: "Distance travelled",
        value: 'metric.distance'
    },
    SLEEP: {
        name: "Sleep",
        description: "Sleep data",
        value: 'metric.sleep'
    },
    ALL_BIOMETRICS: {
        name: "All Biometrics",
        description: "All biometric data",
        value: 'metric.*'
    },
    PUBLIC_PROFILE: {
        name: "Public Profile",
        description: "Public profile (name)",
        value: 'profile.public'
    }
};

module.exports = Object.freeze(ALL_SCOPES);
