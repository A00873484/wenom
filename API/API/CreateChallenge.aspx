<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CreateChallenge.aspx.cs" Inherits="API.CreateChallenge" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Create Challenge page</title>
    <style type="text/css">
        .auto-style2 {
            width: 127px;
        }
    </style>
</head>
<body>
    <form id="form2" runat="server">
    <div style="width: 213px">
        <table style="width: 461px">
            <tr>
                <td>Challenge Name:</td>
                <td>
                    <asp:TextBox ID="tbChallengeName" runat="server" ></asp:TextBox>  
                </td>
                <td class="auto-style2">
                    <asp:RequiredFieldValidator ID="rfvChallengeName" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbChallengeName">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td>Nominee:</td>
                <td>
                    <asp:TextBox ID="tbNominee" runat="server" ></asp:TextBox>  
                </td>
                <td class="auto-style2">
                    <asp:RequiredFieldValidator ID="rfvNominee" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbNominee">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td>Goal:</td>
                <td>
                    <asp:TextBox ID="tbGoal" runat="server"></asp:TextBox>
                </td>
                <td class="auto-style2">
                    <asp:RequiredFieldValidator ID="rfvGoal" runat="server" ErrorMessage="Cannot be blank" ControlToValidate="tbGoal">Cannot be blank</asp:RequiredFieldValidator>
                </td>
            </tr>
        </table>
    </div>
        <p>
            <asp:Button ID="createChallenge" runat="server" OnClick="Button1_Click" Text="create challenge" />
        </p>
    </form>
</body>
</html>
