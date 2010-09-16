# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_lbsc_session',
  :secret      => 'e2fe8830317beb1356069392fdd8839f9440fbc8a0db8545f82a1b3254be001a1dfcc6d63b654cb054bd5877b59454937f8da94524240bc2b01c36e6ede38b93'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
ActionController::Base.session_store = :active_record_store
