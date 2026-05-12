import json
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def lc():
    COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
                 'Azerbaijan', 'Brazil', 'Bulgaria', 'Cameroon', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba',
                 'Cyprus', 'Czech Republic', 'Ecuador', 'Egypt, Arab Rep.', 'Eritrea', 'Ethiopia', 'France', 'Germany',
                 'Ghana', 'Greece', 'India', 'Indonesia', 'Iran, Islamic Rep.', 'Iraq', 'Ireland', 'Italy', 'Japan',
                 'Jordan', 'Kazakhstan', 'Kenya', 'Lebanon', 'Malta', 'Mexico', 'Morocco', 'Pakistan', 'Peru',
                 'Philippines', 'Russian Federation', 'Syrian Arab Republic', 'Tunisia', 'Turkey', 'Ukraine']

    # --- Task 1: Load and Filter ---
    df = pd.read_csv('./static/data/cleaned_data.csv')

    # Filter by countries
    filtered_df = df[df['Country Name'].isin(COUNTRIES)].copy()

    # --- Task 2: PCA (Most recent year: 2020) ---
    # recent_year = 2020
    recent_year = filtered_df['year'].max()
    # filtered_df = filtered_df.fillna(filtered_df.groupby('Country Name').transform('max'))
    # filtered_df = filtered_df.fillna(filtered_df.groupby('Country Name').ffill().bfill())
    filtered_df = filtered_df.fillna(filtered_df.groupby('Country Name').bfill().ffill())
    df_recent = filtered_df[filtered_df['year'] == recent_year].copy()

    # Select numeric columns, excluding ID columns
    features = df_recent.select_dtypes(include=['float64', 'int64']).drop(columns=['year'], errors='ignore')

    # PCA cannot handle a feature that has zero variance or zero data
    # features = features.dropna(axis=1, how='all')

    # PCA requires no NaNs. We fill with column means.
    features_filled = features.fillna(features.mean())
    # features_filled = features.fillna(0)

    # Scaling
    scaled_data = StandardScaler().fit_transform(features_filled)

    # PCA to 2D
    pca = PCA(n_components=2)
    pca_results = pca.fit_transform(scaled_data)

    # Map PCA results back to country names
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
    return pca_list, filtered_df