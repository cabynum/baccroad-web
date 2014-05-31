# README

Here are the steps I used to configure the project.  Everything mentioned in this installation process has already been done/configured.  This text is purely to document the process.

## Installation

### New project

* create the application

```
$ rails new baccroad-web -d mysql
```

* generate the database

```
$ rake db:create db:migrate
```
### Install Piggybak

* add the following gems to the Gemfile

```ruby
gem 'piggybak'
gem 'cancan'
```

* install the bundle and and install piggybak from the command prompt

```
$ bundle install
$ piggybak install
```

RailsAdmin and Devise are both installed with the Piggybak installation.  I'm using CanCan for authorization so I added that gem to the Gemfile as well.

### Configure the Devise Mailer

Devise uses a mailer as a part of the authentication process.  **default\_url\_options** needs to be set appropriately for the different environments.  I added the following line for my development environment in **config/environments/development.rb**:

```ruby
config.action_mailer.default_url_options = { host: 'localhost:3000' }
```

### Generate a devise user

```
$ rails generate devise user
```

Rails creates a user model and configures it with Devise modules. It also creates a migration file located in **db/migrate/devise\_create\_users.rb**.

```
$ rake db:migrate
```

This tells rails to create a table called users.

### Verify sign-up pages

By default, devise created the following pages:

[http://localhost:3000/users/sign_up](http://localhost:3000/users/sign_up)

[http://localhost:3000/users/sign_in](http://localhost:3000/users/sign_in)

### Add login links to the landing page

I created a partial file **app/views/layouts/\_login.html.erb** with following content:

```erb
<% if signed_in? %>
    Logged in as <%= current_user.email %>.
    <%= link_to "Logout", destroy_user_session_path, method: :delete %>
    | <%= link_to "Admin", '/admin' %>
<% else %>
    <%= link_to "Login", new_user_session_path %> | <%= link_to "Sign up now!", new_user_registration_path %>
<% end %>
```

To add it to my other views, I added the following to *app/views/layouts/application.html.erb*:

```erb
<%= render partial: 'layouts/login' %>
```

### Add role to User model

```
$ rails g migration add_role_to_users role:string
```

The following was output to the terminal:

```
	invoke  active_record
	create    db/migrate/20140531165029_add_role_to_users.rb
```

I added the following to the migration created above:

```ruby
class AddRoleToUsers < ActiveRecord::Migration
    def change
        add_column :users, :role, :string
 
        User.create! do |u|
            u.email     = 'cbynum@gmail.com'
            u.password    = 'admin123'
            u.role = 'administrator'
        end
    end
end
```

I excuted the migration to create an example *administrator* user with email *cbynum@gmail.com* and password *admin*.

```
$ rake db:migrate
```

### Add Devise Views

Devise comes with some views OOTB that I can use for customization.  Here is the line to generate them:

```
$ rails generate devise:views
```

### Generate the Ability Class

For authorization I'll be using cancan.  The permissions are driven through an Ability class that can be generated from the command line as follows:

```
$ rails generate cancan:ability
```

### Create the Landing Page

```
$ rails generate controller home index
```

Then added this line to **config/routes.rb**

```ruby
root 'home#index'
```

### Add Flash Messages

I added the tags for flash messages to **app/views/layouts/application.html.erb**

```html+erb
<p class="notice"><%= notice %></p>
<p class="alert"><%= alert %></p>
 ```

### Configure CanCan
