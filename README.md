# README

The following commands can be skipped, however this is how the application is created.

* create the application
	* `rails new baccroad-web -d mysql`
* generate the database
	* `rake db:create db:migrate`

## Installation

### Install Piggybak

* add the following gems to the Gemfile

```ruby
gem 'piggybak'
gem 'devise'
gem 'rails_admin'
```

* build and install piggyback
	* `bundle install`
	* `piggybak install`