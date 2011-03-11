Gameroom::Application.routes.draw do
  
  match 'login' => "user_sessions#new",      :as => :login
  match 'logout' => "user_sessions#destroy", :as => :logout
  resource :user_sessions, :except => [:index, :show]
  
  constraints :subdomain => 'api' do
    scope :module => 'api' do
      resources :customers
      resources :employees
      resources :goods do
        resources :properties
      end
      resources :people do
        resources :addresses
        resources :phones
        resources :emails
      end
      resources :transactions do
        resource :receipt, :only => :show
      end
      resources :tills
      resources :users
    end
  end
  
  constraints :subdomain => 'terminal' do
    scope :module => 'terminal' do
      root :to => 'terminal#index'
    end
  end
  
  constraints :subdomain => 'reports' do
    scope :module => 'reports' do
      root :to => 'reports#index'
    end
  end
  
  constraints :subdomain => 'dashboard' do
    scope :module => 'dashboard' do
      root :to => 'dashboard#index'
    end
  end
  
  #root :to => redirect {|params, request| "http://dashboard.#{request.domain}" }
  #match '*path', :to => redirect {|params, request| "http://dashboard.#{request.domain}" }
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
