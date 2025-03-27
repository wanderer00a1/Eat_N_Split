import React, { useState } from "react";

const initialFriends: friendprop[] = [
  {
    id: 118836,
    name: "Allie",
    image: "https://i.pravatar.cc/48?u=118446",
    balance: 10,
  },
  {
    id: 933372,
    name: "Annie",
    image: "https://i.pravatar.cc/48?u=933572",
    balance: 20,
  },
  {
    id: 499476,
    name: "Mark",
    image: "https://i.pravatar.cc/48?u=464476",
    balance: 0,
  },
];
type friendprop = {
  id: number | string;
  name: string;
  image: string;
  balance: number;
};

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<friendprop | null>(null);

  function handleForm() {
    setShowForm((showForm) => !showForm);
  }
  function addFriend(friend: friendprop) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend: friendprop) {
    setSelected(friend);
  }
  function handleSplit(value: number) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selected?.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          SelectedFriend={selected}
          onSelected={handleSelection}
        />
        {showForm && <AddFriendForm onAdded={addFriend} />}
        <Button onClick={handleForm}>
          {showForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selected && <SplitBill Selected={selected} onSplitBill={handleSplit} />}
    </div>
  );
}

type FriendListProp = {
  friends: friendprop[];
  SelectedFriend: friendprop | null;
  onSelected: (friend: friendprop) => void;
};
function FriendList({
  friends,
  SelectedFriend,
  onSelected,
}: FriendListProp): React.JSX.Element {
  const friendlist = friends;
  return (
    <ul>
      {friendlist.map((friend: friendprop) => (
        <Friend
          key={friend.id}
          friend={friend}
          SelectedFriend={SelectedFriend}
          onSelected={onSelected}
        />
      ))}
    </ul>
  );
}

type FriendProp = {
  friend: friendprop;
  SelectedFriend: friendprop | null;
  onSelected: (friend: friendprop) => void;
};
function Friend({ friend, SelectedFriend, onSelected }: FriendProp) {
  const isSelected = SelectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {friend.balance}$
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelected(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAdded }: { onAdded: (friend: friendprop) => void }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend: friendprop = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAdded(newFriend);
    setName("");
    setImage("");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍👨 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
type Split = {
  Selected: friendprop | null;
  onSplitBill: (value: number) => void;
};
function SplitBill({ Selected, onSplitBill }: Split) {
  const [bill, setBill] = useState(0);
  const [userPay, setUserPay] = useState(0);
  const FriendPay = bill ? bill - userPay : 0;
  const [payer, setPayer] = useState("user");
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!bill || !userPay) return;
    onSplitBill(payer === "user" ? FriendPay : -userPay);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Bill with {Selected?.name}</h2>
      <label>🪙 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️ Your Expense</label>
      <input
        type="text"
        value={userPay}
        onChange={(e) =>
          setUserPay(
            Number(e.target.value) > bill ? userPay : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍👨 {Selected?.name}'s Expense</label>
      <input type="text" disabled value={FriendPay} />

      <label>💳 Who is paying the bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value={Selected?.name}>{Selected?.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}
export default App;
