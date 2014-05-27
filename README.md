# README

Here are the steps I used to configure the project.  Everything mentioned in this installation process has already been done/configured.  This text is purely to document the process.

## Installation

### New project

* create the application
	* `rails new baccroad-web -d mysql`
* generate the database
	* `rake db:create db:migrate`

### Install Piggybak

* add the following gems to the Gemfile

```ruby
gem 'piggybak'
gem 'cancan'
```

* build and install piggyback
	* `bundle install`
	* `piggybak install`

RailsAdmin and Devise are both installed with the Piggybak installation.  I'm using Can Can for authorization so I added that gem to the Gemfile as well.