{
  description = "Witness - VandyHacks Judging Platform";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    bp.url = "github:serokell/nix-npm-buildpackage";
  };

  outputs = { self, nixpkgs, utils, bp }:
    utils.lib.eachDefaultSystem (system:
      with import nixpkgs { inherit system; overlays = [ bp.overlay ]; }; {
        defaultPackage = (buildYarnPackage { src = ./.; }).overrideAttrs (oA: { installPhase = oA.installPhase + "\n ln -s /tmp $out/.next"; });
      }
    );
}
