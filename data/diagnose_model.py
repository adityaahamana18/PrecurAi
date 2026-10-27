import joblib
import numpy as np
import pandas as pd

clf = joblib.load('ml/artifacts/sif_classifier.joblib')
vec = joblib.load('ml/artifacts/tfidf_vectorizer.joblib')

feature_names = np.array(vec.get_feature_names_out())

print('=== CLASSES ===')
print(clf.classes_)

for i, cls_name in enumerate(clf.classes_):
    coefs = clf.coef_[i]
    top_pos_idx = np.argsort(coefs)[-10:][::-1]
    print(f'\n--- Top positive features for {cls_name} ---')
    for idx in top_pos_idx:
        print(f'  {feature_names[idx]}: {coefs[idx]:.4f}')

# Inspect Scenario 4 (PPE observation) in detail
text_ppe = 'An employee was observed walking through the workplace without a safety helmet. No hazardous energy or high-consequence exposure was identified.'
tfidf_ppe = vec.transform([text_ppe]).toarray()[0]
non_zero = np.where(tfidf_ppe > 0)[0]
print('\n=== FEATURE BREAKDOWN FOR SCENARIO 4 (PPE) ===')
for idx in non_zero:
    feat = feature_names[idx]
    val = tfidf_ppe[idx]
    scores = {c: clf.coef_[j][idx] * val for j, c in enumerate(clf.classes_)}
    print(f'Feature: "{feat}" (tfidf: {val:.3f}) -> HIGH: {scores["HIGH"]:.4f}, MEDIUM: {scores["MEDIUM"]:.4f}, LOW: {scores["LOW"]:.4f}, NEI: {scores["NOT_ENOUGH_INFORMATION"]:.4f}')

# Inspect Scenario 1 (Confined space)
text_cs = 'During maintenance, a worker was preparing to enter a confined space. Required gas testing had not been completed before entry. The supervisor identified the issue and stopped the activity. No injury occurred.'
tfidf_cs = vec.transform([text_cs]).toarray()[0]
non_zero_cs = np.where(tfidf_cs > 0)[0]
print('\n=== FEATURE BREAKDOWN FOR SCENARIO 1 (CONFINED SPACE) ===')
for idx in non_zero_cs:
    feat = feature_names[idx]
    val = tfidf_cs[idx]
    scores = {c: clf.coef_[j][idx] * val for j, c in enumerate(clf.classes_)}
    print(f'Feature: "{feat}" (tfidf: {val:.3f}) -> HIGH: {scores["HIGH"]:.4f}, MEDIUM: {scores["MEDIUM"]:.4f}, LOW: {scores["LOW"]:.4f}, NEI: {scores["NOT_ENOUGH_INFORMATION"]:.4f}')
