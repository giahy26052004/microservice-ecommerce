export {};
class Chatbox {
  private args: {
    openButton: HTMLElement | null;
    chatBox: HTMLElement | null;
    sendButton: HTMLElement | null;
  };
  private state: boolean;
  private messages: Array<{ name: string; message: string }>;

  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
    };
    this.state = false;
    this.messages = [];
  }

  display(): void {
    const { openButton, chatBox, sendButton } = this.args;

    if (openButton) {
      openButton.addEventListener("click", () => this.toggleState(chatBox!));
    }

    if (sendButton) {
      sendButton.addEventListener("click", () => this.onSentButton(chatBox!));
    }

    const node = chatBox?.querySelector("input");
    node?.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSentButton(chatBox!);
      }
    });
  }

  private toggleState(chatBox: HTMLElement | null): void {
    this.state = !this.state;
    if (chatBox) {
      if (this.state) {
        chatBox.classList.add("chatbox--active");
      } else {
        chatBox.classList.remove("chatbox--active");
      }
    }
  }

  private onSentButton(chatBox: HTMLElement | null): void {
    const textField = chatBox?.querySelector("input") as HTMLInputElement;
    const text1 = textField.value;

    if (text1 === "") {
      return;
    }

    const msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    fetch("https://ai-chatbot-vgs4.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {

        const msg2 = { name: "Sam", message: data.answer };
        this.messages.push(msg2);
        this.updateChatText(chatBox);
        textField.value = "";
      })
      .catch((error) => {
        console.error(error);
        this.updateChatText(chatBox);
        textField.value = "";
      });
  }

  private updateChatText(chatBox: HTMLElement | null): void {
    let html = "";
    this.messages
      .slice()
      .reverse()
      .forEach((item) => {
        if (item.name === "Sam") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });

    const chatmessage = chatBox?.querySelector(".chatbox__messages");
    if (chatmessage) {
      chatmessage.innerHTML = html;
    }
  }
}

const chatbox = new Chatbox();
chatbox.display();
