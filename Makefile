setup:
	ansible-playbook -i ansible/hosts.ini ansible/setup.yml --ask-vault-pass --ask-become-pass

deploy:
	ansible-playbook -i ansible/hosts.ini ansible/deploy.yml --ask-vault-pass --ask-become-pass