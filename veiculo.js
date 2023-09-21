class Veiculo {
    constructor(modelo, gastoCombustivel, gastoManutencao, consumoKM, tipo) {
        this.modelo = modelo;
        this.gastoCombustivel = gastoCombustivel;
        this.gastoManutencao = gastoManutencao;
        this.consumoKM = consumoKM;
        this.tipo = tipo;
    }

    salvar() {
        const request = indexedDB.open("VeiculosDB", 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore("Veiculos", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("modelo", "modelo", { unique: false });
            objectStore.createIndex("gastoCombustivel", "gastoCombustivel", { unique: false });
            objectStore.createIndex("gastoManutencao", "gastoManutencao", { unique: false });
            objectStore.createIndex("consumoKM", "consumoKM", { unique: false });
            objectStore.createIndex("tipo", "tipo", { unique: false });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("Veiculos", "readwrite");
            const objectStore = transaction.objectStore("Veiculos");
            const request = objectStore.add(this);

            request.onsuccess = function (event) {
                console.log("Veículo salvo com sucesso.");
            };

            request.onerror = function (event) {
                console.error("Erro ao salvar o veículo.");
            };
        }.bind(this);
    }

    editar(callback) {
        const request = indexedDB.open("VeiculosDB", 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("Veiculos", "readwrite");
            const objectStore = transaction.objectStore("Veiculos");

            const request = objectStore.put(this);

            request.onsuccess = function (event) {
                console.log("Veículo editado com sucesso.");
                callback();
            };

            request.onerror = function (event) {
                console.error("Erro ao editar o veículo.");
            };
        }.bind(this);
    }

    deletar(callback) {
        const request = indexedDB.open("VeiculosDB", 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("Veiculos", "readwrite");
            const objectStore = transaction.objectStore("Veiculos");

            const request = objectStore.delete(this.id); // Use o ID do veículo para deletar

            request.onsuccess = function (event) {
                console.log("Veículo deletado com sucesso.");
                callback(); // Chame a função de retorno de chamada após a exclusão ser concluída
            };

            request.onerror = function (event) {
                console.error("Erro ao deletar o veículo.");
            };
        }.bind(this);
    }

    static selecionarPorId(id, callback) {
        const request = indexedDB.open("VeiculosDB", 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("Veiculos", "readonly");
            const objectStore = transaction.objectStore("Veiculos");

            const getRequest = objectStore.get(id); // Usando get() para obter um registro pelo ID

            getRequest.onsuccess = function (event) {
                const veiculo = event.target.result;
                if (veiculo) {
                    console.log("Veículo encontrado:", veiculo);
                    callback(veiculo); // Chame a função de retorno de chamada com o veículo encontrado
                } else {
                    console.error("Veículo não encontrado.");
                    callback(null); // Chame a função de retorno de chamada com null se o veículo não for encontrado
                }
            };

            getRequest.onerror = function (event) {
                console.error("Erro ao selecionar o veículo por ID.");
                callback(null); // Chame a função de retorno de chamada com null em caso de erro
            };
        };
    }

    static listarTodos(callback) {
        const request = indexedDB.open("VeiculosDB", 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore("Veiculos", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("modelo", "modelo", { unique: false });
            objectStore.createIndex("gastoCombustivel", "gastoCombustivel", { unique: false });
            objectStore.createIndex("gastoManutencao", "gastoManutencao", { unique: false });
            objectStore.createIndex("consumoKM", "consumoKM", { unique: false });
            objectStore.createIndex("tipo", "tipo", { unique: false });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("Veiculos", "readonly");
            const objectStore = transaction.objectStore("Veiculos");
            const veiculos = [];

            objectStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    veiculos.push(cursor.value);
                    cursor.continue();
                } else {
                    callback(veiculos);
                }
            };
        };
    }
}