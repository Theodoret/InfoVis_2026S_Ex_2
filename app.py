from flask import Flask, render_template
import json
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# ensure that we can reload when we change the HTML / JS for debugging
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True

COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
             'Azerbaijan', 'Brazil', 'Bulgaria', 'Cameroon', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba',
             'Cyprus', 'Czech Republic', 'Ecuador', 'Egypt, Arab Rep.', 'Eritrea', 'Ethiopia', 'France', 'Germany',
             'Ghana', 'Greece', 'India', 'Indonesia', 'Iran, Islamic Rep.', 'Iraq', 'Ireland', 'Italy', 'Japan',
             'Jordan', 'Kazakhstan', 'Kenya', 'Lebanon', 'Malta', 'Mexico', 'Morocco', 'Pakistan', 'Peru',
             'Philippines', 'Russian Federation', 'Syrian Arab Republic', 'Tunisia', 'Turkey', 'Ukraine']

@app.route('/')
def data():
    # --- Task 1: Load and Filter ---
    df = pd.read_csv('./static/data/cleaned_data.csv')

    # Filter by countries
    filtered_df = df[df['Country Name'].isin(COUNTRIES)].copy()

    # --- Task 2: PCA (Most recent year: 2020) ---
    # recent_year = 2020
    recent_year = filtered_df['year'].max()
    df_recent = filtered_df[filtered_df['year'] == recent_year].copy()

    # Select numeric columns, excluding ID columns
    features = df_recent.select_dtypes(include=['float64', 'int64']).drop(columns=['year'], errors='ignore')

    # 2. CRITICAL: Remove columns that are 100% NaN for this specific selection
    # PCA cannot handle a feature that has zero variance or zero data
    features = features.dropna(axis=1, how='all')

    # PCA requires no NaNs. We fill with column means.
    features_filled = features.fillna(features.mean())

    # Scaling
    scaled_data = StandardScaler().fit_transform(features_filled)

    # PCA to 2D
    pca = PCA(n_components=2)
    pca_results = pca.fit_transform(scaled_data)

    # Map PCA results back to country names
    pca_list = []
    columns_to_extract = [
        'Country Name',
        'Access to electricity (% of population)',
        'Agricultural land (% of land area)',
        'Average precipitation in depth (mm per year)',
        'Employment in agriculture (% of total employment) (modeled ILO estimate)',
        'GDP per capita (current US$)',
        'Land area (sq. km)',
        'Population, total'
    ]

    for i, row in enumerate(df_recent[columns_to_extract].itertuples(index=False, name=None)):
        country, access, agricultural, precipitation, employment, gdp, area, population = row
        pca_list.append({
            "country": country,
            "x": pca_results[i, 0],
            "y": pca_results[i, 1],
            "access": access,
            "agricultural": agricultural,
            "precipitation": precipitation,
            "employment": employment,
            "gdp": gdp,
            "area": area,
            "population": population
        })

    # Prepare JSON for Jinja2
    # We send the full filtered dataset for the time series (1960-2020)
    return render_template(
        "index.html",
        full_data=filtered_df.to_json(orient='records'),
        pca_data=json.dumps(pca_list)
    )


if __name__ == '__main__':
    app.run(debug=True)
