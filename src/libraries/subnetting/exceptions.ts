class SubnetException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubnetException";
  }
}

class InsufficientHostsMaskException extends SubnetException {
  constructor() {
    super(
      "Insufficient hosts mask. Use a bigger mask or set less host per network."
    );
    this.name = "InsufficientHostsMaskException";
  }
}

class InsufficientNetworkMaskException extends SubnetException {
  constructor() {
    super("Insufficient network mask. Use a bigger mask or set less networks.");
    this.name = "InsufficientNetworkMaskException";
  }
}

class InvalidIPException extends SubnetException {
  constructor() {
    super("Invalid IP address.");
    this.name = "InvalidIPException";
  }
}

export {
  SubnetException,
  InsufficientHostsMaskException,
  InsufficientNetworkMaskException,
  InvalidIPException,
};
