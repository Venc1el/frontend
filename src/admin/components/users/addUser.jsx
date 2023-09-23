import { useState } from 'react';
import { Button,Label,Select,Modal,TextInput} from 'flowbite-react';


export default function AddUsers({onAddUser}) {
    const [openModal, setOpenModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [level, setLevel] = useState("Pegawai");

    const handleAddClick = () => {
        if (username.trim() !== "" && password.trim() !== "") {
            onAddUser({
                username: username,
                password: password,
                level: level,
            });

            setUsername("");
            setPassword("");
            setLevel("Pegawai");
            setOpenModal(false);
        } else {
            alert("Please fill in both username and password.");
        }
    };


    return (
        <>
        <Button onClick={() => setOpenModal(true)} className="text-xs">Tambah Akun</Button>
        <Modal
            show={openModal}
            size="xl"
            popup
            onClose={() => setOpenModal(false)}
        >
            <Modal.Header />
            <Modal.Body>
            <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Tambah Akun</h3>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="username" value="Username" />
                    </div>
                    <TextInput
                        id="username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div id="select">
                    <div className="mb-2 block">
                        <Label
                        htmlFor="level"
                        value="Role"
                        />
                    </div>
                    <Select id="level" value={level} onChange={(e) => setLevel(e.target.value)} required>
                        <option>Admin</option>
                        <option>Pegawai</option>
                        <option>RT</option>
                        <option>RW</option>
                        <option>Kelurahan </option>
                    </Select>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password" value="Password" />
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="w-full">
                    <Button onClick= {handleAddClick}>Tambah Akun</Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
        </>
    );
}
