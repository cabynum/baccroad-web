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
