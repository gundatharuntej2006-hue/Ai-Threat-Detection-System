from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
frocls
m sklearn.metrics import accuracy_score, confusion_matrix

app = Flask(__name__)
CORS(app)

model     = joblib.load("threat_model.pkl")
scaler    = joblib.load("scaler.pkl")
le_target = joblib.load("label_encoder.pkl")

FEATURES = [
    "duration","protocol_type","service","flag","src_bytes","dst_bytes","land",
    "wrong_fragment","urgent","hot","num_failed_logins","logged_in","num_compromised",
    "root_shell","su_attempted","num_root","num_file_creations","num_shells",
    "num_access_files","num_outbound_cmds","is_host_login","is_guest_login",
    "count","srv_count","serror_rate","srv_serror_rate","rerror_rate","srv_rerror_rate",
    "same_srv_rate","diff_srv_rate","srv_diff_host_rate","dst_host_count",
    "dst_host_srv_count","dst_host_same_srv_rate","dst_host_diff_srv_rate",
    "dst_host_same_src_port_rate","dst_host_srv_diff_host_rate","dst_host_serror_rate",
    "dst_host_srv_serror_rate","dst_host_rerror_rate","dst_host_srv_rerror_rate"
]

cols = FEATURES + ["label", "difficulty"]

# ── Compute metrics at startup (synchronous) ──────────
print("Loading dataset and training models for metrics...")
try:
    df = pd.read_csv("KDDTrain+.txt", header=None, names=cols)
    df.drop("difficulty", axis=1, inplace=True)

    def map_threat(label):
        if label == "normal": return "LOW"
        elif label in ["neptune","smurf","pod","teardrop","land","back",
                       "apache2","udpstorm","processtable","mailbomb"]: return "HIGH"
        else: return "MEDIUM"

    df["threat_level"] = df["label"].apply(map_threat)
    df.drop("label", axis=1, inplace=True)

    le = LabelEncoder()
    for col in ["protocol_type","service","flag"]:
        df[col] = le.fit_transform(df[col])

    le2 = LabelEncoder()
    df["threat_level"] = le2.fit_transform(df["threat_level"])
    CLASSES = le2.classes_.tolist()

    X = df.drop("threat_level", axis=1)
    y = df["threat_level"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    sc = StandardScaler()
    X_train_s = sc.fit_transform(X_train)
    X_test_s  = sc.transform(X_test)

    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
    rf.fit(X_train_s, y_train)
    rf_pred = rf.predict(X_test_s)
    rf_acc  = round(accuracy_score(y_test, rf_pred) * 100, 2)
    rf_cm   = confusion_matrix(y_test, rf_pred).tolist()
    print(f"RF done: {rf_acc}%")

    print("Training Logistic Regression...")
    lr = LogisticRegression(max_iter=500, random_state=42)
    lr.fit(X_train_s, y_train)
    lr_pred = lr.predict(X_test_s)
    lr_acc  = round(accuracy_score(y_test, lr_pred) * 100, 2)
    lr_cm   = confusion_matrix(y_test, lr_pred).tolist()
    print(f"LR done: {lr_acc}%")

    METRICS = {
        "classes": CLASSES,
        "random_forest":       {"accuracy": rf_acc, "confusion_matrix": rf_cm},
        "logistic_regression": {"accuracy": lr_acc, "confusion_matrix": lr_cm},
    }
    print("All metrics ready!")

except Exception as e:
    print(f"ERROR loading metrics: {e}")
    METRICS = {"error": str(e)}


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data   = request.get_json()
        row    = {f: data.get(f, 0) for f in FEATURES}
        df2    = pd.DataFrame([row])
        scaled = scaler.transform(df2)
        pred   = model.predict(scaled)[0]
        proba  = model.predict_proba(scaled)[0].tolist()
        threat = le_target.inverse_transform([pred])[0]
        conf   = float(max(proba))
        classes = le_target.classes_.tolist()
        return jsonify({
            "threat":        threat,
            "confidence":    round(conf * 100, 2),
            "probabilities": {
                cls: round(float(p) * 100, 2)
                for cls, p in zip(classes, proba)
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/model-metrics", methods=["GET"])
def model_metrics():
    if "error" in METRICS:
        return jsonify(METRICS), 500
    return jsonify(METRICS)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "online"})


if __name__ == "__main__":
    app.run(debug=False, port=5000)
