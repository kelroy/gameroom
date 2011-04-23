class Inventory::InventoryController < ApplicationController
  before_filter :super_authenticate
  
  def index
    render
  end
end