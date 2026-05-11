from flask import Flask, render_template
import json
from Loading_and_cleaning import lc

app = Flask(__name__)

# ensure that we can reload when we change the HTML / JS for debugging
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True



@app.route('/')
def data():

    # replace this with the real data
    testData = ["hello", "infovis", "2026"]
    pca_list, df = lc()
    # return the index file and the data
    return render_template("index.html", data=df.to_json(orient="records"), pca_data=json.dumps(pca_list))


if __name__ == '__main__':
    app.run()