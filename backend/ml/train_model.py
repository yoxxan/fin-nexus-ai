"""
Fin-Nexus AI - Behavioral Credit Risk Assessment Engine
Trained on Telco recharges, utility bill payments, and mobile usage patterns.
Maps alternative behavioral features to a 300-900 creditworthiness score with explainability.
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

# Set seed for reproducibility
np.random.seed(42)

FEATURE_NAMES = [
    "recharge_frequency_per_month",       # Frequency of mobile balance recharges
    "avg_recharge_amount_usd",            # Average amount per top-up ($)
    "recharge_regularity_index",          # 0.0 to 1.0 (standard deviation consistency)
    "utility_bill_ontime_ratio",          # 0.0 to 1.0 (electricity/water on-time rate)
    "mobile_wallet_in_out_ratio",         # Inflow to outflow ratio (liquidity retention)
    "sim_card_tenure_months",             # Duration of active phone number (stability)
    "emergency_airtime_loan_cleared_pct", # Repayment of micro-telco advances
    "nighttime_activity_ratio"            # Behavioral stability marker (0.0 to 1.0)
]

def generate_synthetic_behavioral_data(n_samples=2500):
    """
    Simulates real-world alternative data for unbanked micro-entrepreneurs & rural adults.
    """
    recharge_freq = np.random.poisson(lam=7, size=n_samples) + 1
    avg_recharge = np.random.exponential(scale=6.5, size=n_samples) + 1.5
    recharge_regularity = np.clip(np.random.beta(a=5, b=2, size=n_samples), 0.1, 0.99)
    utility_ontime = np.clip(np.random.beta(a=4, b=1.8, size=n_samples), 0.0, 1.0)
    in_out_ratio = np.clip(np.random.normal(loc=1.1, scale=0.4, size=n_samples), 0.2, 3.5)
    sim_tenure = np.random.randint(2, 84, size=n_samples)
    emergency_cleared = np.clip(np.random.beta(a=6, b=2, size=n_samples), 0.1, 1.0)
    nighttime_act = np.clip(np.random.beta(a=2, b=6, size=n_samples), 0.05, 0.8)

    X = pd.DataFrame({
        "recharge_frequency_per_month": recharge_freq,
        "avg_recharge_amount_usd": avg_recharge,
        "recharge_regularity_index": recharge_regularity,
        "utility_bill_ontime_ratio": utility_ontime,
        "mobile_wallet_in_out_ratio": in_out_ratio,
        "sim_card_tenure_months": sim_tenure,
        "emergency_airtime_loan_cleared_pct": emergency_cleared,
        "nighttime_activity_ratio": nighttime_act
    })

    # Realistic Ground Truth Probability of Good Repayment
    latent_creditworthiness = (
        0.28 * X["utility_bill_ontime_ratio"] +
        0.24 * X["recharge_regularity_index"] +
        0.20 * X["emergency_airtime_loan_cleared_pct"] +
        0.14 * np.clip(X["sim_card_tenure_months"] / 48.0, 0, 1) +
        0.10 * np.clip(X["mobile_wallet_in_out_ratio"] / 1.5, 0, 1) +
        0.04 * np.clip(X["avg_recharge_amount_usd"] / 20.0, 0, 1) -
        0.05 * (X["nighttime_activity_ratio"] > 0.5).astype(int)
    )

    prob = 1 / (1 + np.exp(-10 * (latent_creditworthiness - 0.48)))
    y = (np.random.uniform(0, 1, size=n_samples) < prob).astype(int)

    return X, y

def train_and_export():
    print("[Fin-Nexus AI] Generating synthetic alternative credit dataset...")
    X, y = generate_synthetic_behavioral_data(n_samples=3000)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("[Fin-Nexus AI] Training Gradient Boosting Credit Proxy Model...")
    clf = GradientBoostingClassifier(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=4,
        random_state=42
    )
    clf.fit(X_train, y_train)

    # Evaluate
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, probs)
    print(f"[Fin-Nexus AI] Validation ROC-AUC: {auc:.4f}")
    print(classification_report(y_test, preds))

    # Feature Importance
    feature_importance = dict(zip(FEATURE_NAMES, [round(float(imp), 4) for imp in clf.feature_importances_]))
    print("[Fin-Nexus AI] Feature Importances:", json.dumps(feature_importance, indent=2))

    # Save artifacts
    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, "credit_model.pkl")
    meta_path = os.path.join(output_dir, "model_metadata.json")

    joblib.dump(clf, model_path)
    with open(meta_path, "w") as f:
        json.dump({
            "model_type": "GradientBoostingClassifier (XGBoost alternative)",
            "roc_auc": round(auc, 4),
            "features": FEATURE_NAMES,
            "feature_importance": feature_importance,
            "min_score": 300,
            "max_score": 900
        }, f, indent=2)

    print(f"[Fin-Nexus AI] Model successfully saved to {model_path}")

if __name__ == "__main__":
    train_and_export()
