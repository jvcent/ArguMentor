from app.main import app

if __name__ == "__main__":
  # app.run(debug = True, ssl_context=('app/cert.pem', 'app/key.pem'))
  app.run(debug=True)
