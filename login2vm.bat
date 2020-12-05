@echo off

start ssh -i ./raft.pem azureuser@104.215.20.53
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.20.248
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.20.56
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.20.64
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.20.130
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.21.27
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.9.146
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.20.99
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.21.5
timeout /nobreak 1 > nul
start ssh -i ./raft.pem azureuser@104.215.21.33