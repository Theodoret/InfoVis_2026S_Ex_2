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
    # Task 1: load and filter
    df = pd.read_csv('./static/data/cleaned_data.csv')
    filtered_df = df[df['Country Name'].isin(COUNTRIES)].copy()

    # Task 2: computer a PCA based on the data of the most recent year
    # recent_year = 2020
    recent_year = filtered_df['year'].max()
    # filtered_df = filtered_df.fillna(filtered_df.groupby('Country Name').transform('max'))
    # filtered_df = filtered_df.fillna(filtered_df.groupby('Country Name').ffill().bfill())
    filtered_df = filtered_df.fillna(filtered_df.groupby('Country Name').bfill().ffill())
    df_recent = filtered_df[filtered_df['year'] == recent_year].copy()

    # Task 2: Select numeric columns, excluding ID columns
    features = df_recent.select_dtypes(include=['float64', 'int64']).drop(columns=['year'], errors='ignore')

    # Task 2: PCA requires no NaNs. We fill with column means.
    features_filled = features.fillna(features.mean())
    # features_filled = features.fillna(0)

    # Task 2: Scaling
    scaled_data = StandardScaler().fit_transform(features_filled)

    # Task 2: PCA to 2D
    pca = PCA(n_components=2)
    pca_results = pca.fit_transform(scaled_data)

    # Task 2: Map PCA results back to country names
    pca_list = []
    columns_to_extract = [
        'Country Name',
        'Country Code',
        'Access to electricity (% of population)',
        'Agricultural irrigated land (% of total agricultural land)',
        'Average precipitation in depth (mm per year)',
        'Employment in agriculture (% of total employment) (modeled ILO estimate)',
        'GDP per capita (current US$)',
        'Land area (sq. km)',
        'Population, total'
    ]

    for i, row in enumerate(df_recent[columns_to_extract].itertuples(index=False, name=None)):
        country, code, access, agricultural, precipitation, employment, gdp, area, population = row
        pca_list.append({
            "country": country,
            "code": code,
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

    # Prepare JSON for Jinja2 and send the data
    return render_template(
        "index.html",
        full_data=filtered_df.to_json(orient='records'),
        pca_data=json.dumps(pca_list)
    )


if __name__ == '__main__':
    app.run(debug=True)
