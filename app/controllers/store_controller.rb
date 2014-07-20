class StoreController < ApplicationController
  
  before_action :get_products, only: :index

  def get_products
  	@products = Product.all
  end

  def index
  end
end
