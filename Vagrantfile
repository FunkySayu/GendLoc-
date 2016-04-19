# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/wily64"

  config.vm.network "forwarded_port", guest: 8081, host: 8081, auto_correct:true
  config.vm.network "forwarded_port", guest: 443, host: 443,  auto_correct:true

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get -y install build-essential libssl-dev
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
    source ~/.nvm/nvm.sh
    nvm install 5
    git clone https://github.com/FunkySayu/GendLoc-.git ~/Gendloc
    cd ~/Gendloc/front && npm install
    cd ~/Gendloc/back && npm install
    node .

  SHELL
end